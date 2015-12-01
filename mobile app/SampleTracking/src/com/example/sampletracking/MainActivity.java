package com.example.sampletracking;

import android.support.v7.app.ActionBarActivity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class MainActivity extends ActionBarActivity {

	private Button departure = null;
	private Button arrival = null;
	private Button pickup = null;
	private Button link = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		departure = (Button) findViewById(R.id.button1);
		arrival = (Button) findViewById(R.id.button2);
		pickup = (Button) findViewById(R.id.button3);
		link = (Button) findViewById(R.id.button4);

		departure.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				// Switching to departure screen
				Intent intent = new Intent();
				intent.setClass(MainActivity.this, DepartureInfoActivity.class);
				startActivity(intent);
			}
		});
		
		arrival.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				// Switching to departure screen
				Intent intent = new Intent();
				intent.setClass(MainActivity.this, DepartureInfoActivity.class);
				startActivity(intent);
			}
		});
		
		pickup.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				// Switching to departure screen
				Intent intent = new Intent();
				intent.setClass(MainActivity.this, DepartureInfoActivity.class);
				startActivity(intent);
			}
		});
		
		link.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				// Switching to departure screen
				Intent intent = new Intent();
				intent.setClass(MainActivity.this, DepartureInfoActivity.class);
				startActivity(intent);
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
}
