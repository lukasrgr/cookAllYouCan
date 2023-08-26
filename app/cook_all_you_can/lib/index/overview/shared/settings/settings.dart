import 'dart:developer';

import 'package:accordion/accordion.dart';
import 'package:accordion/controllers.dart';
import 'package:cook_all_you_can/index/overview/shared/settings/colorpicker/colorpicker.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart' as globals;
import 'package:cook_all_you_can/index/overview/shared/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_material_pickers/flutter_material_pickers.dart';
import 'package:intl/intl.dart';
import 'package:settings_ui/settings_ui.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../main.dart';
import '../database/table.dart';

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  final supabase = Supabase.instance.client;
  late Future<List> changelog;

  final _headerStyle = const TextStyle(
      color: Color(0xffffffff), fontSize: 15, fontWeight: FontWeight.normal);

  @override
  void initState() {
    super.initState();
    changelog = getChangelog();
  }

  Future<void> changePrimaryColor(Color color) async {
    globals.saveDataOnDevice("primaryColor", MyThemes.primaryColor.toString());
    setState(() => {
          MyThemes.primaryColor = color,
          isThemeChanging.add(true),
          MyThemes.customTheme = MyThemes.getThemeData(
              MyThemes.primaryColor, MyThemes.secondaryColor)
        });
  }

  Future<void> changeSecondaryColor(Color color) async {
    globals.saveDataOnDevice("secondary", MyThemes.secondaryColor.toString());
    setState(() => {
          MyThemes.secondaryColor = color,
          isThemeChanging.add(true),
          MyThemes.customTheme = MyThemes.getThemeData(
              MyThemes.primaryColor, MyThemes.secondaryColor)
        });
  }

  Future<void> dialogBuilder(
      BuildContext context, String id, Function callback) {
    return showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Pick a color'),
          content: SingleChildScrollView(
              child: ColorPicker(
            pickerColor: MyThemes.primaryColor,
            onColorChanged: (value) {
              globals.saveDataOnDevice(id, MyThemes.primaryColor.toString());
              callback(value);
            },
          )),
          actions: <Widget>[
            ElevatedButton(
              style: ButtonStyle(
                  backgroundColor: MaterialStateColor.resolveWith(
                      (states) => MyThemes.primaryColor)),
              child: const Text(
                'Ändern',
                style: TextStyle(color: Colors.black),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                showAboutDialog(
                  context: context,
                  useRootNavigator: true,
                  children: <Widget>[
                    Padding(
                        padding: EdgeInsets.only(top: 15),
                        child: Text(
                            'Es wird empfohlen, die App neuzustarten, um alle Style Änderungen sehen zu können.'))
                  ],
                );
              },
            )
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
        appBar: getAppBar(context, 'Einstellungen'),
        body: Column(children: [
          Expanded(
              child: SingleChildScrollView(
                  child: Column(children: [
            FutureBuilder<List>(
                future: changelog,
                builder: (BuildContext context,
                    AsyncSnapshot<List<dynamic>> snapshot) {
                  // ignore: unused_local_variable
                  List<Widget> widgets = [];

                  if (!snapshot.hasData) {
                    return Center(
                        child: Column(children: [
                      globals.ThemedCircularProgressIndicator
                    ]));
                  }

                  if (snapshot.hasData) {
                    widgets.add(Accordion(
                        maxOpenSections: 1,
                        headerBackgroundColorOpened: Colors.black54,
                        scaleWhenAnimating: true,
                        openAndCloseAnimation: true,
                        headerPadding: const EdgeInsets.symmetric(
                            vertical: 7, horizontal: 15),
                        sectionOpeningHapticFeedback:
                            SectionHapticFeedback.light,
                        sectionClosingHapticFeedback:
                            SectionHapticFeedback.light,
                        contentBorderColor: Colors.green,
                        children: [
                          AccordionSection(
                              isOpen: true,
                              contentBorderColor: Colors.black,
                              leftIcon: const Icon(Icons.build_sharp,
                                  color: Colors.white),
                              header: Text('Custom User Settings',
                                  style: _headerStyle),
                              contentBackgroundColor: MyThemes.secondaryColor,
                              content: Column(children: [
                                Card(
                                    color: MyThemes.primaryColor,
                                    child: ListTile(
                                        title: Row(
                                          children: [
                                            Text(
                                              "Primärfarbe",
                                              style: TextStyle(
                                                  color:
                                                      MyThemes.secondaryColor),
                                            ),
                                          ],
                                        ),
                                        onTap: () {
                                          dialogBuilder(context, 'primaryColor',
                                              changePrimaryColor);
                                        },
                                        onLongPress: () {
                                          buildAlertDialog(
                                              () => setState(() => {
                                                    MyThemes.primaryColor =
                                                        MyThemes
                                                            .defaultPrimaryColor,
                                                    globals.saveDataOnDevice(
                                                        "primaryColor", "")
                                                  }));
                                          ;
                                        })),
                                Card(
                                    color: MyThemes.secondaryColor,
                                    child: ListTile(
                                        title: Row(
                                          children: [
                                            Text(
                                              "Sekundärfarbe",
                                              style: TextStyle(
                                                  color: MyThemes.primaryColor),
                                            ),
                                          ],
                                        ),
                                        onTap: () {
                                          dialogBuilder(
                                              context,
                                              'secondaryColor',
                                              changeSecondaryColor);
                                        },
                                        onLongPress: () {
                                          buildAlertDialog(
                                              () => setState(() => {
                                                    MyThemes.secondaryColor =
                                                        MyThemes
                                                            .defaultSecondaryColor,
                                                    globals.saveDataOnDevice(
                                                        "secondaryColor", "")
                                                  }));
                                        }))
                              ])),
                          AccordionSection(
                              isOpen: false,
                              contentBorderColor: Colors.black,
                              leftIcon: const Icon(Icons.build_sharp,
                                  color: Colors.white),
                              header: Text('Changelog', style: _headerStyle),
                              contentBackgroundColor: MyThemes.secondaryColor,
                              content: Accordion(
                                  maxOpenSections: 1,
                                  headerBackgroundColorOpened: Colors.black54,
                                  headerPadding: const EdgeInsets.symmetric(
                                      vertical: 0, horizontal: 15),
                                  children: [
                                    for (var x = 0;
                                        x < snapshot.requireData.length;
                                        x++) ...[
                                      AccordionSection(
                                          isOpen: false,
                                          contentBorderColor: Colors.black,
                                          header: Text(
                                              '${DateFormat('dd. MMMM').format(DateTime.parse((snapshot.requireData[x] as Map)['created_at']))}',
                                              style: _headerStyle),
                                          contentBackgroundColor:
                                              MyThemes.secondaryColor,
                                          content: Column(children: [
                                            for (var i = 0;
                                                i <
                                                    snapshot.requireData[x]
                                                            ['text']
                                                        .split(',')
                                                        .length;
                                                i++) ...[
                                              Row(children: [
                                                Text(
                                                  "\u2022",
                                                  style:
                                                      TextStyle(fontSize: 30),
                                                ), //bullet text
                                                SizedBox(
                                                  width: 10,
                                                ), //space between bullet and text
                                                Expanded(
                                                  child: Text(snapshot
                                                      .requireData[x]['text']
                                                      .split(',')[i]), //text
                                                )
                                              ])
                                            ]
                                          ]))
                                    ]
                                  ]))
                        ]));
                  }

                  return Column(children: widgets);
                })
          ])))
        ]));
  }

  Future<List> getChangelog() async {
    var result = [];
    await supabase
        .from('changelog') //
        .select('*')
        .order('id', ascending: true) //
        .then((value) {
      result = value;
    });

    return new Future.value(result);
  }

  buildAlertDialog(Function callback) {
    return showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            content: SingleChildScrollView(
              child: ListBody(
                children: const <Widget>[
                  Text('Farbe auf den Standard zurücksetzen?'),
                ],
              ),
            ),
            actions: <Widget>[
              Row(
                children: [
                  Column(
                    children: [
                      TextButton(
                        child: Text(
                          'Ja',
                          style: TextStyle(color: MyThemes.primaryColor),
                        ),
                        onPressed: () {
                          callback();
                          Navigator.of(context).pop();
                        },
                      ),
                    ],
                  ),
                  Spacer(),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        child: Text('Nein',
                            style: TextStyle(color: MyThemes.primaryColor)),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                      ),
                    ],
                  )
                ],
              )
            ],
          );
        });
  }
}
