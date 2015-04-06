package com.darwino.robovm.common.settings.controls;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.UITableView;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITableViewCellAccessoryType;
import org.robovm.apple.uikit.UITableViewCellStyle;
import org.robovm.apple.uikit.UITableViewController;
import org.robovm.apple.uikit.UITableViewStyle;


public class MultiValuePicker extends UITableViewController {
	public static interface MultiValuePickerCallback {
		void handle(Object pickedValue);
	}
	
	private class MyTableViewCell extends UITableViewCell {
		@Override
		protected long init (UITableViewCellStyle style, String reuseIdentifier) {
			return super.init(UITableViewCellStyle.Subtitle, reuseIdentifier);
		}
	}
	private final static String MY_CELL_IDENTIFIER = "MyTableViewCell3";
	
	private final List<String> labels;
	private final List<Object> values;
	private final MultiValuePickerCallback callback;
	private int selectedIndex;
	private final List<UITableViewCell> cells = new ArrayList<UITableViewCell>();
	
	public MultiValuePicker(Collection<String> labels, Collection<Object> values, Object defaultValue, MultiValuePickerCallback callback) {
		super(UITableViewStyle.Grouped);
		
		this.labels = new ArrayList<>(labels);
		this.values = new ArrayList<>(values);
		selectedIndex = this.values.indexOf(defaultValue);
		this.callback = callback;
	}
	
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		getTableView().registerReusableCellClass(MyTableViewCell.class, MY_CELL_IDENTIFIER);
	}
	
	@Override
	public long getNumberOfSections(UITableView tableView) {
		return 1;
	}
	
	@Override
	public long getNumberOfRowsInSection(UITableView tableView, long section) {
		return labels.size();
	}
	
	@Override
	public UITableViewCell getCellForRow(UITableView tableView, NSIndexPath indexPath) {
		UITableViewCell cell = getTableView().dequeueReusableCell(MY_CELL_IDENTIFIER, indexPath);

		int index = (int) NSIndexPathExtensions.getRow(indexPath);
		cell.getTextLabel().setText(labels.get(index));
		if(index == selectedIndex) {
			cell.setAccessoryType(UITableViewCellAccessoryType.Checkmark);
		}
		
		cells.add(index, cell);
	
		return cell;
	}
	
	@Override
	public void didSelectRow(UITableView tableView, NSIndexPath indexPath) {
		int index = (int) NSIndexPathExtensions.getRow(indexPath);
		this.callback.handle(values.get(index));
		
		cells.get(selectedIndex).setAccessoryType(UITableViewCellAccessoryType.None);
		this.selectedIndex = index;
		cells.get(selectedIndex).setAccessoryType(UITableViewCellAccessoryType.Checkmark);
		
		getNavigationController().popViewController(true);
	}
}
