import 'package:accordion/accordion.dart';
import 'package:accordion/controllers.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:cook_all_you_can/index/pages/shared/utils.dart';
import 'package:cook_all_you_can/index/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../main.dart';

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
    var notification =
        showNotification(context, "Currently disabled", Colors.orange);
    return;
  }

  Future<void> changeSecondaryColor(Color color) async {
    // globals.saveDataOnDevice("secondary", MyThemes.secondaryColor.toString());
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
              // globals.saveDataOnDevice(id, MyThemes.primaryColor.toString());
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
                      MyThemes.ThemedCircularProgressIndicator
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
                                          buildAlertDialog(() => setState(
                                                () => MyThemes.primaryColor =
                                                    MyThemes
                                                        .defaultPrimaryColor,
                                              ));
                                        })),
                              ])),
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
