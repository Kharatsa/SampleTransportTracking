package com.example.sampletracking;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class DepartureInfoActivity extends Activity implements OnClickListener {
	private Button region, facility;
	private Button rider;
	private Button vehicleNum;
	private Button next;
	private Context mContext;
	private TextView regionText,facilityText;
	private TextView riderText;
	private TextView vehicleNumText;
	private int selected = 0;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_departureinfo);
		mContext = this; // to use all around this class
		initView();
		initViewAction();

	}

	private void initView() {
		region = (Button) findViewById(R.id.button1);
		facility = (Button) findViewById(R.id.facility);
		regionText = (TextView) findViewById(R.id.text1);
		facilityText = (TextView) findViewById(R.id.text11);
		rider = (Button) findViewById(R.id.button2);
		riderText = (TextView) findViewById(R.id.text2);
		vehicleNum = (Button) findViewById(R.id.button3);
		vehicleNumText = (TextView) findViewById(R.id.text3);
		next = (Button) findViewById(R.id.button4);

	}

	private void initViewAction() {
		region.setOnClickListener(this);
		facility.setOnClickListener(this);
		rider.setOnClickListener(this);
		vehicleNum.setOnClickListener(this);
		next.setOnClickListener(this);
	}

	@Override
	public void onClick(View view) {

		if (view.equals(region)) {
			RegionButtonClick();
		} else if (view.equals(rider)) {
			RiderButtonClick();
		} else if (view.equals(vehicleNum)) {
			VehicleButtonClick();
		} else if (view.equals(next)) {
			NextButtonClick();
		} else if(view.equals(facility)){
			FacilityButtonClick();
		}
	}

	private void RegionButtonClick() {
		AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
		builder.setTitle("Choose Region");

		final CharSequence[] choiceList = { "Maseru", "Morija", "Roma", "Berea Hospiital", "Quthing", "Leribe" };

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
						regionText.setText(choiceList[selected]);
					}
				});

		AlertDialog alert = builder.create();
		alert.show();
	}
	
	private void FacilityButtonClick() {
		AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
		builder.setTitle("Choose Facility");

		final CharSequence[] choiceList = { "Khubetsoana", "Domiciliary", "Mabote", "Qoaling", "Loretto", "Thaba Bosiu", "LDF","SDA" };

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
						facilityText.setText(choiceList[selected]);
					}
				});

		AlertDialog alert = builder.create();
		alert.show();
	}

	private void RiderButtonClick() {
		AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
		builder.setTitle("Choose Rider Name");

		final CharSequence[] choiceList = { "Rider #1", "Rider #2" };

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
						riderText.setText(choiceList[selected]);
					}
				});

		AlertDialog alert = builder.create();
		alert.show();
	}

	private void VehicleButtonClick() {
		AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
		builder.setTitle("Choose Vehicle Num");

		final CharSequence[] choiceList = { "#1111","#1112","#1113","#1114","#1115"};

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
						vehicleNumText.setText(choiceList[selected]);
					}
				});

		AlertDialog alert = builder.create();
		alert.show();
	}

	private void NextButtonClick() {
		// Switching to departure screen
		Intent intent = new Intent();
		intent.setClass(DepartureInfoActivity.this, ScanActivity.class);
		startActivity(intent);
	}
}
