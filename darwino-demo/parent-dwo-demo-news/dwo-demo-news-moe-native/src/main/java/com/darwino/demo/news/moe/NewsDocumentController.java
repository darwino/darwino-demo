/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.darwino.demo.news.moe;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.jsonstore.Document;
import org.moe.natj.general.NatJ;
import org.moe.natj.general.Pointer;
import org.moe.natj.general.ann.Owned;
import org.moe.natj.general.ann.RegisterOnStartup;
import org.moe.natj.objc.ObjCRuntime;
import org.moe.natj.objc.SEL;
import org.moe.natj.objc.ann.ObjCClassName;
import org.moe.natj.objc.ann.Selector;

import apple.NSObject;
import apple.coregraphics.c.CoreGraphics;
import apple.coregraphics.struct.CGRect;
import apple.foundation.NSMutableAttributedString;
import apple.foundation.NSNotification;
import apple.foundation.NSNotificationCenter;
import apple.foundation.NSNumber;
import apple.foundation.NSValue;
import apple.uikit.UIBarButtonItem;
import apple.uikit.UIColor;
import apple.uikit.UIFont;
import apple.uikit.UITableViewController;
import apple.uikit.UITextView;
import apple.uikit.UIView;
import apple.uikit.enums.UIBarButtonSystemItem;
import apple.uikit.enums.UIInterfaceOrientation;
import apple.uikit.enums.UIKeyboardType;
import apple.uikit.enums.UIReturnKeyType;
import apple.uikit.enums.UITextAutocorrectionType;
import apple.uikit.protocol.UITextViewDelegate;

/**
 * The view controller for hosting the UIControls features of this sample.
 */
@org.moe.natj.general.ann.Runtime(ObjCRuntime.class)
@ObjCClassName("NewsDocumentController")
@RegisterOnStartup
public class NewsDocumentController extends UITableViewController {

    static {
        NatJ.register();
    }

    @Owned
    @Selector("alloc")
    public static native NewsDocumentController alloc();

    @Override
	@Selector("init")
    public native NewsDocumentController init();

    protected NewsDocumentController(Pointer peer) {
        super(peer);
    }

    private UITextView textView;
    private String documentId;
    private String category;

    private NSObject keyboardWillShowObserver;
    private NSObject keyboardWillHideObserver;

    public String getDocumentId() {
        return documentId;
    }

    public String getCategory() {
        return category;
    }

    @Override
    public void viewDidLoad() {
        super.viewDidLoad();

        view().setFrame(CoreGraphics.CGRectMake(0, 0, 320, 460));

        textView = UITextView.alloc().initWithFrame(view().frame());
        textView.setTextColor(UIColor.blackColor());
        textView.setFont(UIFont.fontWithNameSize("Arial", 18.0));
        textView.setDelegate(new UITextViewDelegate() {
             @Override
             public void textViewDidBeginEditing(UITextView textView) {
                 UIBarButtonItem saveItem = UIBarButtonItem.alloc()
                         .initWithBarButtonSystemItemTargetAction(
                                 UIBarButtonSystemItem.Done, NewsDocumentController.this,
                                 new SEL("saveAction"));
                 navigationItem().setRightBarButtonItem(saveItem);
             }
         });
        textView.setBackgroundColor(UIColor.whiteColor());
        //textView.setAutoresizingMask(UIViewAutoresizing.FlexibleWidth.set(UIViewAutoresizing.FlexibleHeight));

        textView.setReturnKeyType(UIReturnKeyType.Default);
        textView.setKeyboardType(UIKeyboardType.Default);
        textView.setScrollEnabled(true);
        textView.setAutocorrectionType(UITextAutocorrectionType.No);

        view().addSubview(textView);
    }

    /**
     * setup components and load to UI
     */
    public void loadDocument(String category, String documentId) {
        this.category = category;
        this.documentId = documentId;
    }

    @Selector("keyboardWillShow:")
    public void keyboardWillShow(Object notification) {
        adjustViewForKeyboardReveal(true, (NSNotification ) notification);
    }

    @Selector("keyboardWillHide:")
    public void keyboardWillHide(Object notification) {
        adjustViewForKeyboardReveal(false, (NSNotification ) notification);
    }

    @Override
    public void viewWillAppear(boolean animated) {
        super.viewWillAppear(animated);
        NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(this,
                new SEL("keyboardWillShow:"),
                apple.uikit.c.UIKit.UIKeyboardWillShowNotification(),
                null);
        NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(this,
                new SEL("keyboardWillHide:"),
                apple.uikit.c.UIKit.UIKeyboardWillHideNotification(),
                null);
        try {
            Document doc = NewsManifest.getNewsStore().loadDocument(documentId);

            this.setTitle(doc.getString("title"));

            NSMutableAttributedString attrString = NSMutableAttributedString.alloc()
                    .initWithString(doc.getString("content"));
            this.textView.setAttributedText(attrString);
        } catch(Exception t) {
            Platform.log(t);
        }
    }

    /**
     * Called when to finish typing text/dismiss the keyboard by removing it as
     * the first responder
     */
    @Selector("saveAction")
    private void saveAction() {
        this.textView.resignFirstResponder();
        this.navigationItem().setRightBarButtonItem(null); // this will
        // remove the
        // "save" button
    }

    private boolean isPortrait(long orientation) {
        return ((orientation == UIInterfaceOrientation.Portrait) ||
                (orientation == UIInterfaceOrientation.PortraitUpsideDown));
    }

    /**
     * Modifies keyboards size to fit screen
     * @param showKeyboard
     * @param notification
     */
    private void adjustViewForKeyboardReveal (boolean showKeyboard, NSNotification notification) {
        // the keyboard is showing so resize the table's height
        CGRect keyboardRect = ((NSValue) notification.userInfo().get(apple.uikit.c.UIKit
                .UIKeyboardFrameEndUserInfoKey())).CGRectValue();
        double animationDuration = ((NSNumber) notification.userInfo().get(apple.uikit.c.UIKit
                .UIKeyboardAnimationDurationUserInfoKey())).doubleValue();
        CGRect frame = textView.frame();
        // the keyboard rect's width and height are reversed in landscape
        double adjustDelta = isPortrait(interfaceOrientation()) ? keyboardRect.size().height() :
                keyboardRect.size().width();

        if (showKeyboard) {
            frame.size().setHeight(frame.size().height() - adjustDelta);
        } else {
            frame.size().setHeight(frame.size().height() + adjustDelta);
        }

        UIView.beginAnimationsContext("ResizeForKeyboard", null);
        UIView.setAnimationDuration_static(animationDuration);
        textView.setFrame(frame);
        UIView.commitAnimations();
    }

    @Override
    public void viewDidDisappear(boolean animated) {
        super.viewDidDisappear(animated);

        NSNotificationCenter.defaultCenter().removeObserver(keyboardWillShowObserver);
        NSNotificationCenter.defaultCenter().removeObserver(keyboardWillHideObserver);
    }

}
