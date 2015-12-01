package com.example.sampletracking;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import android.support.v7.app.ActionBarActivity;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.Toast;

public class ScanActivity extends Activity implements OnClickListener {

	private Button typeBtn, scanBtn, reportBtn, okayBtn, submitBtn;
	private TextView typeTxt, contentTxt;
	private ListView listView;
	private ArrayList<String> content, type, condition;
	private int selected = 0;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_scan);

		typeBtn = (Button) findViewById(R.id.button1);
		typeTxt = (TextView) findViewById(R.id.text1);
		scanBtn = (Button) findViewById(R.id.button2);
		reportBtn = (Button) findViewById(R.id.report);
		okayBtn = (Button) findViewById(R.id.okay);
		contentTxt = (TextView) findViewById(R.id.scan_content);
		listView = (ListView) findViewById(R.id.list);
		submitBtn = (Button) findViewById(R.id.submit);

		typeBtn.setOnClickListener(this);
		scanBtn.setOnClickListener(this);
		reportBtn.setOnClickListener(this);
		okayBtn.setOnClickListener(this);
		submitBtn.setOnClickListener(this);

		content = new ArrayList<String>();
		type = new ArrayList<String>();
		condition = new ArrayList<String>();

	}

	public void onClick(View v) {
		// respond to clicks
		if (v.getId() == R.id.button1) {
			TypeButtonClick();

		} else if (v.getId() == R.id.button2) {
			// scan
			IntentIntegrator scanIntegrator = new IntentIntegrator(this);
			scanIntegrator.initiateScan();
		} else if (v.getId() == R.id.report) {
			Question();
			/*
			ArrayList<HashMap<String, Object>> listItem = new ArrayList<HashMap<String, Object>>();
			if (type.size() < content.size())
				type.add(type.get(type.size() - 1));
			for (int i = 0; i < content.size(); ++i) {
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("ItemTitle", content.get(i));
				map.put("ItemType", type.get(i));
				map.put("ItemCondition", condition.get(i));
				listItem.add(map);
			}
			SimpleAdapter mAdapter = new SimpleAdapter(ScanActivity.this,
					listItem, R.layout.simplerow, new String[] { "ItemTitle",
							"ItemType", "ItemCondition" }, new int[] {
							R.id.ItemTitle, R.id.ItemType, R.id.ItemCondition });
			listView.setAdapter(mAdapter);*/
		} else if (v.getId() == R.id.okay) {
			condition.add("Fine");
			ArrayList<HashMap<String, Object>> listItem = new ArrayList<HashMap<String, Object>>();
			if (type.size() < content.size())
				type.add(type.get(type.size() - 1));
			for (int i = 0; i < content.size(); ++i) {
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("ItemTitle", content.get(i));
				map.put("ItemType", type.get(i));
				map.put("ItemCondition", condition.get(i));
				listItem.add(map);
			}
			SimpleAdapter mAdapter = new SimpleAdapter(ScanActivity.this,
					listItem, R.layout.simplerow, new String[] { "ItemTitle",
							"ItemType", "ItemCondition" }, new int[] {
							R.id.ItemTitle, R.id.ItemType, R.id.ItemCondition });
			listView.setAdapter(mAdapter);
		} else if (v.getId() == R.id.submit) {
			SubmitButtonClick();
		}
	}

	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		// retrieve scan result
		IntentResult scanningResult = IntentIntegrator.parseActivityResult(
				requestCode, resultCode, intent);
		if (scanningResult != null) {
			// we have a result
			String scanContent = scanningResult.getContents();
			String scanFormat = scanningResult.getFormatName();
			// contentTxt.setText("CONTENT: " + scanContent);
			content.add(scanContent);
		} else {
			Toast toast = Toast.makeText(getApplicationContext(),
					"No scan data received!", Toast.LENGTH_SHORT);
			toast.show();
		}
	}

	private void TypeButtonClick() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Choose Sample Type");

		final CharSequence[] choiceList = { "Blood", "Sputum", "Urine", "Dried blood spot", "Other" };

		builder.setSingleChoiceItems(choiceList, selected,
				new DialogInterface.OnClickListener() {

					@Override
					public void onClick(DialogInterface dialog, int which) {
						selected = which;
					}
				}).setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						typeTxt.setText(choiceList[selected]);
						type.add((String) choiceList[selected]);
					}
				});

		AlertDialog alert = builder.create();
		alert.show();
	}
	
	private void Question() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Choose issue");

		final CharSequence[] choiceList = { "Broken", "Badform", "Missingform","Other problem" };

		builder.setSingleChoiceItems(choiceList, selected,
				new DialogInterface.OnClickListener() {

					@Override
					public void onClick(DialogInterface dialog, int which) {
						selected = which;
					}
				}).setCancelable(false)
				.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						//typeTxt.setText(choiceList[selected]);ui
						condition.add((String) choiceList[selected]);
						
						ArrayList<HashMap<String, Object>> listItem = new ArrayList<HashMap<String, Object>>();
						if (type.size() < content.size())
							type.add(type.get(type.size() - 1));
						for (int i = 0; i < content.size(); ++i) {
							HashMap<String, Object> map = new HashMap<String, Object>();
							map.put("ItemTitle", content.get(i));
							map.put("ItemType", type.get(i));
							map.put("ItemCondition", condition.get(i));
							listItem.add(map);
						}
						SimpleAdapter mAdapter = new SimpleAdapter(ScanActivity.this,
								listItem, R.layout.simplerow, new String[] { "ItemTitle",
										"ItemType", "ItemCondition" }, new int[] {
										R.id.ItemTitle, R.id.ItemType, R.id.ItemCondition });
						listView.setAdapter(mAdapter);
					}
				});

		AlertDialog alert = builder.create();
		alert.show();
		
	}

	private void SubmitButtonClick() {
		AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);

		// set title
		alertDialogBuilder.setTitle("Message");

		// set dialog message
		alertDialogBuilder.setMessage(
				"Your data has been successfully submitted!")
				.setPositiveButton("Yes",
						new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								// if this button is clicked, close
								// current activity
								Intent intent = new Intent();
								intent.setClass(ScanActivity.this,
										MainActivity.class);
								startActivity(intent);
							}
						});
		// create alert dialog
		AlertDialog alertDialog = alertDialogBuilder.create();

		// show it
		alertDialog.show();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.scan, menu);
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
