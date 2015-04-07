package com.darwino.robovm.common.settings.toast;


import java.util.Timer;
import java.util.TimerTask;

import org.robovm.apple.coregraphics.CGAffineTransform;
import org.robovm.apple.coregraphics.CGPoint;
import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.coregraphics.CGSize;
import org.robovm.apple.foundation.NSAttributedString;
import org.robovm.apple.foundation.NSDictionary;
import org.robovm.apple.foundation.NSInvocation;
import org.robovm.apple.foundation.NSMethodSignature;
import org.robovm.apple.foundation.NSObject;
import org.robovm.apple.foundation.NSRunLoop;
import org.robovm.apple.foundation.NSRunLoopMode;
import org.robovm.apple.foundation.NSString;
import org.robovm.apple.foundation.NSTimer;
import org.robovm.apple.uikit.NSAttributedStringAttributes;
import org.robovm.apple.uikit.NSStringDrawingContext;
import org.robovm.apple.uikit.NSStringDrawingOptions;
import org.robovm.apple.uikit.NSTextAlignment;
import org.robovm.apple.uikit.UIApplication;
import org.robovm.apple.uikit.UIButton;
import org.robovm.apple.uikit.UIButtonType;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UIControlEvents;
import org.robovm.apple.uikit.UIFont;
import org.robovm.apple.uikit.UIImage;
import org.robovm.apple.uikit.UIImageView;
import org.robovm.apple.uikit.UIInterfaceOrientation;
import org.robovm.apple.uikit.UILabel;
import org.robovm.apple.uikit.UIView;
import org.robovm.apple.uikit.UIWindow;
import org.robovm.objc.Selector;
import org.robovm.objc.annotation.BindSelector;
import org.robovm.rt.bro.annotation.Callback;

// An implementation of https://github.com/ecstasy2/toast-notifications-ios/blob/master/iToast.m
public class Toast extends NSObject {
	private ToastSettings settings;
	private NSTimer timer;
	private UIView view;
	private String text;
	
	public static final int COMPONENT_PADDING = 5;
	public static final int CURRENT_TOAST_TAG = 6984678;
	
	public static Toast makeText(String text) {
		return new Toast(text);
	}
	
	public Toast(String text) {
		this.text = text;
	}
	
	public void show() {
		show(ToastType.None);
	}
	public void show(ToastType type) {
		ToastSettings settings = getSettings();
		
		UIImage image = settings.getImages().get(new NSString(type.toString()));
		
		UIFont font = UIFont.getSystemFont(settings.getFontSize());
		
		NSAttributedStringAttributes attributes = new NSAttributedStringAttributes();
		attributes.setFont(font);
		NSAttributedString attributedText = new NSAttributedString(text, attributes);
		CGRect rect = attributedText.getBoundingRect(new CGSize(280, 60), NSStringDrawingOptions.UsesLineFragmentOrigin, (NSStringDrawingContext)null);
		
		CGSize textSize = rect.getSize();
		
		UILabel label = new UILabel(new CGRect(0, 0, textSize.getWidth() + COMPONENT_PADDING, textSize.getHeight() + COMPONENT_PADDING));
		label.setBackgroundColor(UIColor.clear());
		label.setTextColor(UIColor.white());
		label.setFont(font);
		label.setText(text);
		label.setNumberOfLines(0);
		if(settings.isUseShadow()) {
			label.setShadowColor(UIColor.darkGray());
			label.setShadowOffset(new CGSize(1, 1));
		}
		
		UIButton v = UIButton.create(UIButtonType.Custom);
		if(image != null) {
			v.setFrame(toastFrame(image.getSize(), settings.getImageLocation(), textSize));
			
			switch(settings.getImageLocation()) {
			case Left:
				label.setTextAlignment(NSTextAlignment.Left);
				label.setCenter(new CGPoint(image.getSize().getWidth() + COMPONENT_PADDING * 2
						+ (v.getFrame().getSize().getWidth() - image.getSize().getWidth() - COMPONENT_PADDING * 2) / 2,
						v.getFrame().getSize().getHeight() / 2));
				break;
			case Top:
				label.setTextAlignment(NSTextAlignment.Center);
				label.setCenter(new CGPoint(v.getFrame().getSize().getWidth() / 2,
						(image.getSize().getHeight() + COMPONENT_PADDING * 2
						+ v.getFrame().getSize().getHeight() - image.getSize().getHeight() - COMPONENT_PADDING * 2) / 2));
				break;
			default:
				break;	
			}
		} else {
			v.setFrame(new CGRect(0, 0, textSize.getWidth() + COMPONENT_PADDING * 2, textSize.getHeight() + COMPONENT_PADDING * 2));
			label.setCenter(new CGPoint(v.getFrame().getSize().getWidth() / 2, v.getFrame().getSize().getHeight() / 2));
		}
		CGRect lbfrm = label.getFrame();
		lbfrm.getOrigin().setX(Math.ceil(lbfrm.getOrigin().getX()));
		lbfrm.getOrigin().setY(Math.ceil(lbfrm.getOrigin().getY()));
		label.setFrame(lbfrm);;
		v.addSubview(label);
		
		if(image != null) {
			UIImageView imageView = new UIImageView(image);
			imageView.setFrame(imageFrame(type, v.getFrame()));
			v.addSubview(imageView);
		}
		
		v.setBackgroundColor(new UIColor(settings.getBgRed(), settings.getBgGreen(), settings.getBgBlue(), settings.getBgAlpha()));
		v.getLayer().setCornerRadius(settings.getCornerRadius());
		
		UIWindow window = UIApplication.getSharedApplication().getWindows().get(0);
		
		CGPoint point = CGPoint.Zero();
		
		// Set correct orientation/location regarding device orientation
		UIInterfaceOrientation orientation = UIApplication.getSharedApplication().getStatusBarOrientation();
		switch(orientation) {
		case Portrait: {
			switch(settings.getGravity()) {
			case Top:
				point = new CGPoint(window.getFrame().getSize().getWidth() / 2, 45);
				break;
			case Bottom:
				point = new CGPoint(window.getFrame().getSize().getWidth() / 2, window.getFrame().getSize().getHeight() - 45);
				break;
			case Center:
				point = new CGPoint(window.getFrame().getSize().getWidth() / 2, window.getFrame().getSize().getHeight() / 2);
				break;
			default:
				point = settings.getPosition();
				break;
			}
			
			point = new CGPoint(point.getX() + settings.getOffsetLeft(), point.getY() + settings.getOffsetTop());
			break;
		}
		case PortraitUpsideDown: {
			v.setTransform(CGAffineTransform.createRotation(Math.PI));
			
			double width = window.getFrame().getSize().getWidth();
			double height = window.getFrame().getSize().getHeight();
			
			switch(settings.getGravity()) {
			case Top:
				point = new CGPoint(width / 2, height - 45);
				break;
			case Bottom:
				point = new CGPoint(width / 2, 45);
				break;
			case Center:
				point = new CGPoint(width / 2, height / 2);
				break;
			default:
				// This is un-handled in the original code as well
				point = settings.getPosition();
				break;
			}
			
			break;
		}
		case LandscapeLeft: {
			v.setTransform(CGAffineTransform.createRotation(Math.PI / 2));
			
			double width = window.getFrame().getSize().getWidth();
			double height = window.getFrame().getSize().getHeight();
			
			switch(settings.getGravity()) {
			case Top:
				point = new CGPoint(width - 45, height / 2);
				break;
			case Bottom:
				point = new CGPoint(45, height / 2);
				break;
			case Center:
				point = new CGPoint(width / 2, height / 2);
				break;
			default:
				// This is un-handled in the original code as well
				point = settings.getPosition();
				break;
			}
			
			break;
		}
		case LandscapeRight: {
			v.setTransform(CGAffineTransform.createRotation(-Math.PI / 2));
			
			double width = window.getFrame().getSize().getWidth();
			double height = window.getFrame().getSize().getHeight();
			
			switch(settings.getGravity()) {
			case Top:
				point = new CGPoint(45, height / 2);
				break;
			case Bottom:
				point = new CGPoint(width - 45, height / 2);
				break;
			case Center:
				point = new CGPoint(width / 2, height / 2);
				break;
			default:
				// This is un-handled in the original code as well
				point = settings.getPosition();
				break;
			}
			break;
		}
		default: {
			break;
		}
		}
		
		v.setCenter(point);
		v.setFrame(v.getFrame().integral());

	
//		Selector selector = Selector.register("hideToast:");
//		timer = NSTimer.create(settings.getDuration() / 1000f, this, selector, null, false);
//		NSRunLoop.getMain().addTimer(NSRunLoopMode.Default, timer);
		
		
		v.setTag(CURRENT_TOAST_TAG);
		
		
		UIView currentToast = window.getViewWithTag(CURRENT_TOAST_TAG);
		if(currentToast != null) {
			currentToast.removeFromSuperview();
		}
		
		v.setAlpha(0);
		window.addSubview(v);
		UIView.beginAnimations(null, null);
		v.setAlpha(1);
		UIView.commitAnimations();
		
		this.view = v;
		

		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override public void run() {
				System.out.println("hiding toast");
				UIView.beginAnimations(null, null);
				view.setAlpha(0);
				UIView.commitAnimations();
				view.removeFromSuperview();
			}
		}, settings.getDuration());
//		v.addTarget(this, selector, UIControlEvents.TouchDown);
	}
	
	public void hideToast(NSTimer theTimer) {
		UIView.beginAnimations(null, null);
		view.setAlpha(0);
		UIView.commitAnimations();
		
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override public void run() {
				removeToast(null);
			}
		}, 500);
		
//		Selector selector = Selector.register("removeToast:");
//		timer = NSTimer.create(500, this, selector, null, false);
//		NSRunLoop.getMain().addTimer(NSRunLoopMode.Default, timer);
	}
	
	public void removeToast(NSObject theTimer) {
		System.out.println("fired removeToast");
		view.removeFromSuperview();
	}
	
	public Toast setDuration(int duration) {
		getSettings().setDuration(duration);
		return this;
	}
	public Toast setGravity(ToastGravity gravity, long offsetLeft, long offsetTop) {
		getSettings().setGravity(gravity);
		getSettings().setOffsetLeft(offsetLeft);
		getSettings().setOffsetTop(offsetTop);
		return this;
	}
	public Toast setPosition(CGPoint position) {
		getSettings().setPosition(position.copy());
		return this;
	}
	public Toast setFontSize(double fontSize) {
		getSettings().setFontSize(fontSize);
		return this;
	}
	public Toast setUseShadow(boolean useShadow) {
		getSettings().setUseShadow(useShadow);
		return this;
	}
	public Toast setCornerRadius(double cornerRadius) {
		getSettings().setCornerRadius(cornerRadius);
		return this;
	}
	public Toast setBgReg(double bgRed) {
		getSettings().setBgRed(bgRed);
		return this;
	}
	public Toast setBgGreen(double bgGreen) {
		getSettings().setBgGreen(bgGreen);
		return this;
	}
	public Toast setBgBlue(double bgBlue) {
		getSettings().setBgBlue(bgBlue);
		return this;
	}
	public Toast setBgAlpha(double bgAlpha) {
		getSettings().setBgAlpha(bgAlpha);
		return this;
	}
	
	
	/* ************************************************************************************************
	 * Internal utility methods
	 **************************************************************************************************/
	
	private ToastSettings getSettings() {
		if(settings == null) {
			settings = ToastSettings.getSharedSettings().clone();
		}
		return settings;
	}
	
	private CGRect toastFrame(CGSize imageSize, ToastImageLocation location, CGSize textSize) {
		CGRect rect = CGRect.Zero();
		switch(location) {
		case Left:
			rect = new CGRect(0, 0, imageSize.getWidth() + textSize.getWidth() + COMPONENT_PADDING * 3, Math.max(textSize.getHeight(), imageSize.getHeight()) + COMPONENT_PADDING * 2);
			break;
		case Top:
			rect = new CGRect(0, 0, Math.max(textSize.getWidth(), imageSize.getWidth()) + COMPONENT_PADDING * 2, imageSize.getHeight() + textSize.getHeight() + COMPONENT_PADDING * 2);
			break;
		default:
			break;
		}
		return rect;
	}
	private CGRect imageFrame(ToastType type, CGRect toastFrame) {
		ToastSettings settings = getSettings();
		UIImage image = settings.getImages().get(new NSString(type.name()));
		
		if(image == null) {
			return CGRect.Zero();
		}
		
		CGRect imageFrame = CGRect.Zero();
		
		switch(settings.getImageLocation()) {
		case Left:
			imageFrame = new CGRect(COMPONENT_PADDING, (toastFrame.getSize().getHeight() - image.getSize().getHeight()) / 2, image.getSize().getWidth(), image.getSize().getHeight());
			break;
		case Top:
			imageFrame = new CGRect((toastFrame.getSize().getWidth() - image.getSize().getWidth()) / 2, COMPONENT_PADDING, image.getSize().getWidth(), image.getSize().getHeight());
			break;
		default:
			break;
		}
		return imageFrame;
	}
}
