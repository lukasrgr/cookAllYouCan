import 'dart:developer';

import 'package:accordion/accordion.dart';
import 'package:accordion/controllers.dart';
import 'package:cook_all_you_can/index/overview/shared/database/table.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../shared/settings/theme/theme.dart';
import '../shared/utils.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class History extends StatefulWidget {
  const History({super.key});

  @override
  State<History> createState() => HistoryState();
}

class HistoryState extends State<History> {
  final supabase = Supabase.instance.client;
  late Future<List<_ChartData>> data;
  late TooltipBehavior _tooltip = TooltipBehavior(enable: true);

  final _headerStyle = const TextStyle(
      color: Color(0xffffffff), fontSize: 15, fontWeight: FontWeight.normal);

  @override
  void initState() {
    setState(() {
      data = fillChartData();
    });
    inspect(data);
    super.initState();
  }

  Future<List<_ChartData>> fillChartData() async {
    List<_ChartData> result = [];
    await supabase
        .from(CalendarDayWithEvent().TABLENAME)
        .select('recipe_id,recipe(name)')
        .then((calendarEvents) {
      var map = new Map<String, int?>();
      Map.fromIterable(calendarEvents, key: (e) {
        if (map.containsKey(e['recipe']["name"])) {
          var counter = map[e['recipe']["name"]]!;
          return map[e['recipe']["name"]] = counter + 1;
        } else {
          return map[e['recipe']["name"]] = 1;
        }
      });

      map.forEach((key, value) {
        result.add(_ChartData(key, value ?? 0));
      });

      // return Future.value(result);
    }).whenComplete(() {
      setState(() {
        data = Future.value(result);
      });
    });

    throw new Error();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
      child: SingleChildScrollView(
          child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Accordion(
            maxOpenSections: 1,
            headerBackgroundColorOpened: Colors.black54,
            scaleWhenAnimating: true,
            openAndCloseAnimation: true,
            headerPadding:
                const EdgeInsets.symmetric(vertical: 7, horizontal: 15),
            sectionOpeningHapticFeedback: SectionHapticFeedback.light,
            sectionClosingHapticFeedback: SectionHapticFeedback.light,
            contentBorderColor: Colors.green,
            children: [
              AccordionSection(
                isOpen: true,
                contentBorderColor: Colors.black,
                leftIcon:
                    const Icon(Icons.soup_kitchen_rounded, color: Colors.white),
                header: Text('Kochhistorie', style: _headerStyle),
                contentBackgroundColor: MyThemes.secondaryColor,
                content: Accordion(
                  maxOpenSections: 1,
                  headerBackgroundColorOpened: Colors.black54,
                  headerPadding:
                      const EdgeInsets.symmetric(vertical: 0, horizontal: 15),
                  children: [
                    AccordionSection(
                      isOpen: true,
                      leftIcon:
                          const Icon(Icons.bar_chart, color: Colors.white),
                      headerBackgroundColor: Colors.black38,
                      headerBackgroundColorOpened: Colors.black54,
                      contentBackgroundColor: MyThemes.secondaryColor,
                      header: Text('Wie oft wurde was gekocht ?',
                          style: _headerStyle),
                      content:
                          // ],)
                          FutureBuilder<List<_ChartData>>(
                              future: data,
                              builder: (BuildContext context,
                                  AsyncSnapshot<List<_ChartData>> snapshot) {
                                Widget widget = new Container(
                                  child: Center(
                                      child: ThemedCircularProgressIndicator),
                                );

                                if (snapshot.hasData) {
                                  widget = SfCartesianChart(
                                    // isTransposed: true,
                                    primaryXAxis:
                                        CategoryAxis(isVisible: false),
                                    primaryYAxis: NumericAxis(
                                        labelStyle: TextStyle(
                                            overflow: TextOverflow.ellipsis)),
                                    tooltipBehavior: _tooltip,

                                    series: <ChartSeries<_ChartData, String>>[
                                      BarSeries<_ChartData, String>(
                                        dataSource: snapshot.requireData,
                                        xValueMapper: (_ChartData data, _) =>
                                            data.x,
                                        yValueMapper: (_ChartData data, _) =>
                                            data.y,
                                        dataLabelSettings: DataLabelSettings(
                                            overflowMode: OverflowMode.shift,
                                            labelPosition:
                                                ChartDataLabelPosition.inside,
                                            labelAlignment:
                                                ChartDataLabelAlignment.bottom,
                                            builder: (dynamic data, _, __, ___,
                                                ____) {
                                              return Text('${data.x}',
                                                  style: TextStyle(
                                                      overflow:
                                                          TextOverflow.fade,
                                                      color: Colors.black,
                                                      fontWeight:
                                                          FontWeight.w300,
                                                      fontSize: 15));
                                              // );
                                            },
                                            isVisible: true),
                                        pointColorMapper:
                                            (_ChartData data, _) =>
                                                MyThemes.primaryColor,
                                        name: 'Rezept',
                                      )
                                    ],
                                  );
                                }
                                return widget;
                              }),
                      contentHorizontalPadding: 20,
                      // contentBorderColor: Colors.grey,
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Expandable(
          //   // <-- Driven by ExpandableController from ExpandableNotifier
          //   collapsed: ExpandableButton(
          //     // <-- Expands when tapped on the cover photo
          //     child: Text("Test"),
          //   ),
          //   expanded: Column(children: [
          //     FutureBuilder<List<_ChartData>>(
          //         future: data,
          //         builder: (BuildContext context,
          //             AsyncSnapshot<List<_ChartData>> snapshot) {
          //           inspect(snapshot);
          //           Widget widget = new Container(
          //             child: Center(
          //               child: Text("No Data"),
          //             ),
          //           );

          //           if (snapshot.hasData) {
          //             inspect(snapshot.requireData);
          //             widget = SfCartesianChart(
          //                 // isTransposed: true,
          //                 primaryXAxis: CategoryAxis(),
          //                 primaryYAxis: NumericAxis(),
          //                 tooltipBehavior: _tooltip,
          //                 series: <ChartSeries<_ChartData, String>>[
          //                   BarSeries<_ChartData, String>(
          //                     dataSource: snapshot.requireData,
          //                     xValueMapper: (_ChartData data, _) => data.x,
          //                     yValueMapper: (_ChartData data, _) => data.y,
          //                     pointColorMapper: (_ChartData data, _) =>
          //                         primaryColor,
          //                     name: 'Rezept',
          //                     color: Color.fromRGBO(8, 142, 255, 1),
          //                   )
          //                 ]);
          //           }

          //           return widget;
          //         }),
          //     ExpandableButton(
          //       // <-- Collapses when tapped on
          //       child: Text("Back"),
          //     ),
          //   ]),
          // ),
        ],
      )),

      // children: [
      //   FutureBuilder<List<_ChartData>>(
      //       future: data,
      //       builder: (BuildContext context,
      //           AsyncSnapshot<List<_ChartData>> snapshot) {
      //         inspect(snapshot);
      //         Widget widget = new Container(
      //           child: Center(
      //             child: Text("No Data"),
      //           ),
      //         );

      //         if (snapshot.hasData) {
      //           inspect(snapshot.requireData);
      //           widget = SfCartesianChart(
      //               // isTransposed: true,
      //               primaryXAxis: CategoryAxis(),
      //               primaryYAxis: NumericAxis(),
      //               tooltipBehavior: _tooltip,
      //               series: <ChartSeries<_ChartData, String>>[
      //                 BarSeries<_ChartData, String>(
      //                   dataSource: snapshot.requireData,
      //                   xValueMapper: (_ChartData data, _) => data.x,
      //                   yValueMapper: (_ChartData data, _) => data.y,
      //                   pointColorMapper: (_ChartData data, _) => primaryColor,
      //                   name: 'Rezept',
      //                   color: Color.fromRGBO(8, 142, 255, 1),
      //                 )
      //               ]);
      //         }

      //         return widget;
      //       })
      // ],
    ));
    // ));
  }
}

class _ChartData {
  _ChartData(this.x, this.y);

  final String x;
  final int y;
}
