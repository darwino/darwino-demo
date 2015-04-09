package com.darwino.commons.robovm.ui.toast;

import java.util.Map;

import org.robovm.apple.coregraphics.CGPoint;
import org.robovm.apple.foundation.NSDictionary;
import org.robovm.apple.foundation.NSObject;
import org.robovm.apple.foundation.NSString;
import org.robovm.apple.uikit.UIImage;

public class ToastSettings implements Cloneable {
	private static ToastSettings sharedSettings;
	
	public static ToastSettings getSharedSettings() {
		if(sharedSettings == null) {
			sharedSettings = new ToastSettings();
			sharedSettings.setGravity(ToastGravity.Center);
			sharedSettings.setDuration(ToastDuration.Short);
			sharedSettings.setFontSize(16);
			sharedSettings.setUseShadow(true);
			sharedSettings.setCornerRadius(5);
			sharedSettings.setBgRed(0);
			sharedSettings.setBgGreen(0);
			sharedSettings.setBgBlue(0);
			sharedSettings.setBgAlpha(0.7);
			sharedSettings.setOffsetLeft(0);
			sharedSettings.setOffsetTop(0);
		}
		return sharedSettings;
	}
	
	private int duration;
	private ToastGravity gravity;
	private CGPoint position;
	private double fontSize;
	private boolean useShadow;
	private double cornerRadius;
	private double bgRed;
	private double bgGreen;
	private double bgBlue;
	private double bgAlpha;
	private long offsetLeft;
	private long offsetTop;
	private NSDictionary<NSString, UIImage> images = new NSDictionary<NSString, UIImage>();
	private ToastImageLocation imageLocation;
	
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}
	public void setDuration(ToastDuration duration) {
		this.duration = duration.getDuration();
	}
	public ToastGravity getGravity() {
		return gravity;
	}
	public void setGravity(ToastGravity gravity) {
		this.gravity = gravity;
	}
	public CGPoint getPosition() {
		return position;
	}
	public void setPosition(CGPoint position) {
		this.position = position;
	}
	public double getFontSize() {
		return fontSize;
	}
	public void setFontSize(double fontSize) {
		this.fontSize = fontSize;
	}
	public boolean isUseShadow() {
		return useShadow;
	}
	public void setUseShadow(boolean useShadow) {
		this.useShadow = useShadow;
	}
	public double getCornerRadius() {
		return cornerRadius;
	}
	public void setCornerRadius(double cornerRadius) {
		this.cornerRadius = cornerRadius;
	}
	public double getBgRed() {
		return bgRed;
	}
	public void setBgRed(double bgRed) {
		this.bgRed = bgRed;
	}
	public double getBgGreen() {
		return bgGreen;
	}
	public void setBgGreen(double bgGreen) {
		this.bgGreen = bgGreen;
	}
	public double getBgBlue() {
		return bgBlue;
	}
	public void setBgBlue(double bgBlue) {
		this.bgBlue = bgBlue;
	}
	public double getBgAlpha() {
		return bgAlpha;
	}
	public void setBgAlpha(double bgAlpha) {
		this.bgAlpha = bgAlpha;
	}
	public long getOffsetLeft() {
		return offsetLeft;
	}
	public void setOffsetLeft(long offsetLeft) {
		this.offsetLeft = offsetLeft;
	}
	public long getOffsetTop() {
		return offsetTop;
	}
	public void setOffsetTop(long offsetTop) {
		this.offsetTop = offsetTop;
	}
	public ToastImageLocation getImageLocation() {
		return imageLocation;
	}
	public void setImageLocation(ToastImageLocation imageLocation) {
		this.imageLocation = imageLocation;
	}
	public NSDictionary<NSString, UIImage> getImages() {
		return images;
	}
	
	public void setImage(UIImage img, ToastImageLocation location, ToastType type) {
		if(type == ToastType.None) {
			return;
		}
		
		if(img != null) {
			NSString key = new NSString(type.name());
			images.put(key, img);
		}
		
		this.imageLocation = location;
	}
	public void setImage(UIImage img, ToastType type) {
		setImage(img, ToastImageLocation.Left, type);
	}
	
	@Override
	protected ToastSettings clone() {
		ToastSettings copy = new ToastSettings();
		copy.setGravity(gravity);
		copy.setDuration(duration);
		copy.setPosition(position == null ? null : position.copy());
		copy.setFontSize(fontSize);
		copy.setUseShadow(useShadow);
		copy.setCornerRadius(cornerRadius);
		copy.setBgRed(bgRed);
		copy.setBgGreen(bgGreen);
		copy.setBgBlue(bgBlue);
		copy.setBgAlpha(bgAlpha);
		copy.setOffsetLeft(offsetLeft);
		copy.setOffsetTop(offsetTop);
		if(images != null) {
			for(Map.Entry<NSString, UIImage> entry : images.entrySet()) {
				copy.setImage(entry.getValue(), ToastType.valueOf(entry.getKey().toString()));
			}
		}
		copy.setImageLocation(imageLocation);
		return copy;
	}
}