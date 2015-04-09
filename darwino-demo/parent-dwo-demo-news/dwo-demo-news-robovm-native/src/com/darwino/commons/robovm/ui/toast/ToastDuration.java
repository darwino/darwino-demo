package com.darwino.commons.robovm.ui.toast;

public enum ToastDuration {
	Long(10000), Short(1000), Normal(3000);
	
	private int duration;
	private ToastDuration(int duration) {
		this.duration = duration;
	}
	public int getDuration() {
		return duration;
	}
}