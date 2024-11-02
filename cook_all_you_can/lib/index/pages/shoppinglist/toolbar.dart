import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../shared/service/service.dart' as Serv;
import '../../theme/theme.dart';

class ShoppingListToolbarWidget extends StatefulWidget {
  late final Function(String startDate, String endDate)? callback;
/**
 * MultiSelectChipField's to filter recipes
 * 
 * @callback used to update recipes
 * 
 * @recipe the recipes
 */
  ShoppingListToolbarWidget({super.key, required this.callback}) {}

  @override
  State<ShoppingListToolbarWidget> createState() =>
      _ShoppingListToolbarWidgetState();
}

class _ShoppingListToolbarWidgetState extends State<ShoppingListToolbarWidget> {
  _ShoppingListToolbarWidgetState() {}

  late String startDate = Serv.DateHelper.startDate;
  late String endDate = Serv.DateHelper.endDate;
  final double widgetHeight = 36;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Column(children: [
            SizedBox(
                height: widgetHeight,
                child: FloatingActionButton.extended(
                    heroTag: "btn1",
                    backgroundColor: MyThemes.primaryColor.withOpacity(0.9),
                    shape: MyThemes.roundedRectangleBorder,
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                                backgroundColor: MyThemes.canvasBackgroundColor,
                                title: Text(''),
                                content: Container(
                                  width: MediaQuery.of(context).size.width,
                                  height:
                                      MediaQuery.of(context).size.height / 2.5,
                                  child: Column(
                                    children: <Widget>[
                                      SfDateRangePicker(
                                        rangeSelectionColor: MyThemes
                                            .primaryColor
                                            .withOpacity(0.5),
                                        rangeTextStyle: TextStyle(
                                            color: MyThemes.textColor),
                                        selectionTextStyle:
                                            TextStyle(color: Colors.black),
                                        todayHighlightColor: Colors.white,
                                        headerStyle: DateRangePickerHeaderStyle(
                                            textStyle:
                                                TextStyle(color: Colors.white)),
                                        monthViewSettings:
                                            DateRangePickerMonthViewSettings(
                                                viewHeaderStyle:
                                                    DateRangePickerViewHeaderStyle(
                                                        textStyle: TextStyle(
                                                            color:
                                                                Colors.white))),
                                        monthCellStyle:
                                            DateRangePickerMonthCellStyle(
                                                leadingDatesTextStyle:
                                                    TextStyle(
                                                        color: Colors.white),
                                                textStyle: TextStyle(
                                                    color: Colors.white)),
                                        onSelectionChanged: _onSelectionChanged,
                                        selectionMode:
                                            DateRangePickerSelectionMode.range,
                                        initialSelectedRange: PickerDateRange(
                                          DateTime.parse(startDate),
                                          DateTime.parse(endDate),
                                        ),
                                        initialDisplayDate:
                                            DateTime.parse(startDate),
                                      ),
                                      MaterialButton(
                                        child: Text("OK"),
                                        onPressed: () {
                                          setState(() {
                                            widget.callback!(
                                                startDate, endDate);
                                          });
                                          Navigator.pop(context);
                                        },
                                      )
                                    ],
                                  ),
                                ));
                          });
                    },
                    label: Text(startDate + " - " + endDate,
                        style: TextStyle(color: Colors.black)))),
          ]),
          Column(children: [
            SizedBox(
                height: widgetHeight,
                child: FloatingActionButton.extended(
                  heroTag: "btn2",
                  backgroundColor: MyThemes.primaryColor.withOpacity(0.9),
                  shape: MyThemes.roundedRectangleBorder,
                  onPressed: () {
                    widget.callback!(startDate, endDate);
                  },
                  label: Row(
                    children: [
                      Icon(
                        Icons.refresh,
                        color: Colors.black,
                      ),
                    ],
                  ),
                  // child: Icon(
                  //   Icons.refresh,
                  //   color: primaryColor,
                  // ),
                ))
          ])
        ]);
  }

  void _onSelectionChanged(DateRangePickerSelectionChangedArgs args) {
    setState(() {
      args.value.startDate != null
          ? startDate =
              DateFormat('yyyy-MM-dd').format(args.value.startDate).toString()
          : null;
      args.value.endDate != null
          ? endDate =
              DateFormat('yyyy-MM-dd').format(args.value.endDate).toString()
          : null;
      Serv.DateHelper.startDate = startDate;
      Serv.DateHelper.startDate = endDate;
    });
  }
}
