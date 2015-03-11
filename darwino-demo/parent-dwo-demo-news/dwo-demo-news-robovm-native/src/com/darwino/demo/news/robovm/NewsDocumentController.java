/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
 */

package com.darwino.demo.news.robovm;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.foundation.NSMutableAttributedString;
import org.robovm.apple.foundation.NSNotificationCenter;
import org.robovm.apple.foundation.NSObject;
import org.robovm.apple.uikit.UIBarButtonItem;
import org.robovm.apple.uikit.UIBarButtonSystemItem;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UIFont;
import org.robovm.apple.uikit.UIInterfaceOrientation;
import org.robovm.apple.uikit.UIKeyboardAnimation;
import org.robovm.apple.uikit.UIKeyboardType;
import org.robovm.apple.uikit.UIReturnKeyType;
import org.robovm.apple.uikit.UITableViewController;
import org.robovm.apple.uikit.UITextAutocorrectionType;
import org.robovm.apple.uikit.UITextView;
import org.robovm.apple.uikit.UITextViewDelegateAdapter;
import org.robovm.apple.uikit.UIView;
import org.robovm.apple.uikit.UIWindow;
import org.robovm.objc.annotation.Method;
import org.robovm.objc.block.VoidBlock1;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.jsonstore.Document;

/**
 * 
 */
public class NewsDocumentController extends UITableViewController {

    private UITextView textView;
    private String documentId;
    private String category;
    
    private NSObject keyboardWillShowObserver;
    private NSObject keyboardWillHideObserver;
    
    public NewsDocumentController() {
    }

    public String getDocumentId() {
		return documentId;
	}

	public String getCategory() {
		return category;
	}

	@Override
    public void viewDidLoad() {
        super.viewDidLoad();

        getView().setFrame(new CGRect(0, 0, 320, 460));
        
        textView = new UITextView(getView().getFrame());
        textView.setTextColor(UIColor.black());
        textView.setFont(UIFont.getFont("Arial", 18.0));
        textView.setDelegate(new UITextViewDelegateAdapter() {
            @Override
            public void didBeginEditing (UITextView textView) {
                UIBarButtonItem saveItem = new UIBarButtonItem(UIBarButtonSystemItem.Done, new UIBarButtonItem.OnClickListener() {
                    @Override
                    public void onClick (UIBarButtonItem barButtonItem) {
                        /** Called when to finish typing text/dismiss the keyboard by removing it as the first responder */
                        NewsDocumentController.this.textView.resignFirstResponder();
                        getNavigationItem().setRightBarButtonItem(null); // this will remove the "save" button
                    }
                });
                getNavigationItem().setRightBarButtonItem(saveItem);
            }
        });
        textView.setBackgroundColor(UIColor.white());
        //textView.setAutoresizingMask(UIViewAutoresizing.FlexibleWidth.set(UIViewAutoresizing.FlexibleHeight));

        textView.setReturnKeyType(UIReturnKeyType.Default);
        textView.setKeyboardType(UIKeyboardType.Default);
        textView.setScrollEnabled(true);
        textView.setAutocorrectionType(UITextAutocorrectionType.No);

        getView().addSubview(textView);  
    }

    /**
     * setup components and load to UI
     */
    public void loadDocument(String category, String documentId) {
    	this.category = category;
    	this.documentId = documentId;
    }

    @Override
    public void viewWillAppear(boolean animated) {
        super.viewWillAppear(animated);
        keyboardWillShowObserver = UIWindow.Notifications.observeKeyboardWillShow(new VoidBlock1<UIKeyboardAnimation>() {
            @Override
            public void invoke (UIKeyboardAnimation a) {
                adjustViewForKeyboardReveal(true, a);
            }
        });
        keyboardWillHideObserver = UIWindow.Notifications.observeKeyboardWillHide(new VoidBlock1<UIKeyboardAnimation>() {
            @Override
            public void invoke (UIKeyboardAnimation a) {
                adjustViewForKeyboardReveal(false, a);
            }
        });
        
    	try {
    		Document doc = NewsManifest.getNewsStore().loadDocument(documentId);
    		
            this.setTitle(doc.getString("title"));

            NSMutableAttributedString attrString = new NSMutableAttributedString(doc.getString("content"));
            this.textView.setAttributedText(attrString);
    	} catch(Throwable t) {
    		Platform.log(t);
    	}
    }
    
    /**
     * Called when to finish typing text/dismiss the keyboard by removing it as
     * the first responder
     */
    @Method(selector = "saveAction")
    private void saveAction() {
        this.textView.resignFirstResponder();
        this.getNavigationItem().setRightBarButtonItem(null); // this will
                                                              // remove the
                                                              // "save" button
    }

    private boolean isPortrait(UIInterfaceOrientation orientation) {
        return ((orientation == UIInterfaceOrientation.Portrait) || (orientation == UIInterfaceOrientation.PortraitUpsideDown));
    }

    /**
     * Modifies keyboards size to fit screen
     * 
     * @param showKeyboard
     * @param notificationInfo
     */
    private void adjustViewForKeyboardReveal (boolean showKeyboard, UIKeyboardAnimation animation) {
        // the keyboard is showing so resize the table's height

        CGRect keyboardRect = animation.getEndFrame();
        double animationDuration = animation.getAnimationDuration();

        CGRect frame = textView.getFrame();

        // the keyboard rect's width and height are reversed in landscape
        double adjustDelta = isPortrait(getInterfaceOrientation()) ? keyboardRect.getHeight() : keyboardRect.getWidth();

        if (showKeyboard) {
            frame.getSize().setHeight(frame.getSize().getHeight() - adjustDelta);
        } else {
            frame.getSize().setHeight(frame.getSize().getHeight() + adjustDelta);
        }

        UIView.beginAnimations("ResizeForKeyboard", null);
        UIView.setAnimationDurationInSeconds(animationDuration);
        textView.setFrame(frame);
        UIView.commitAnimations();
    }

    @Override
    public void viewDidDisappear(boolean animated) {
        super.viewDidDisappear(animated);

        NSNotificationCenter.getDefaultCenter().removeObserver(keyboardWillShowObserver);
        NSNotificationCenter.getDefaultCenter().removeObserver(keyboardWillHideObserver);
    }

}
