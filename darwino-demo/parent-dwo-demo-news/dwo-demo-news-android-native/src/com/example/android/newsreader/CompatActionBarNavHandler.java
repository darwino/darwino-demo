/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
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

/*
 * Copyright (C) 2011 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.newsreader;

import android.app.ActionBar.OnNavigationListener;
import android.app.ActionBar.Tab;
import android.app.ActionBar.TabListener;
import android.app.FragmentTransaction;

import com.darwino.application.jsonstore.NewsManifest;

/**
 * Adapter for action bar navigation events.
 *
 * This class implements an adapter that facilitates handling of action bar navigation events.
 * An instance of this class must be installed as a TabListener or OnNavigationListener on an
 * Action Bar, and it will relay the navigation events to a configured listener
 * (a {@link CompatActionBarNavListener}).
 *
 * This class should only be instanced and used on Android platforms that support the Action Bar,
 * that is, SDK level 11 and above.
 */
public class CompatActionBarNavHandler implements TabListener, OnNavigationListener {
    // The listener that we notify of navigation events
    CompatActionBarNavListener mNavListener;

    /**
     * Constructs an instance with the given listener.
     *
     * @param listener the listener to notify when a navigation event occurs.
     */
    public CompatActionBarNavHandler(CompatActionBarNavListener listener) {
        mNavListener = listener;
    }

    /**
     * Called by framework when a tab is selected.
     *
     * This will cause a navigation event to be delivered to the configured listener.
     */
    @Override
    public void onTabSelected(Tab tab, FragmentTransaction ft) {
        mNavListener.onCategorySelected(NewsManifest.getCategoryFilter(tab.getPosition()));
    }

    /**
     * Called by framework when a item on the navigation menu is selected.
     *
     * This will cause a navigation event to be delivered to the configured listener.
     */
    @Override
    public boolean onNavigationItemSelected(int itemPosition, long itemId) {
        mNavListener.onCategorySelected(NewsManifest.getCategoryFilter(itemPosition));
        return true;
    }


    /**
     * Called by framework when a tab is re-selected. That is, it was already selected and is
     * tapped on again. This is not used in our app.
     */
    @Override
    public void onTabReselected(Tab tab, FragmentTransaction ft) {
        // we don't care
    }

    /**
     * Called by framework when a tab is unselected. Not used in our app.
     */
    @Override
    public void onTabUnselected(Tab tab, FragmentTransaction ft) {
        // we don't care
    }

}
