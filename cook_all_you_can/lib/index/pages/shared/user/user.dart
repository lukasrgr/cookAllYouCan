import 'dart:developer';

import 'package:cook_all_you_can/index/pages/shared/database/sqflite/query.dart';
import 'package:cook_all_you_can/index/pages/shared/service/service.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../settings/theme/theme.dart';
import '../shared.dart';
import '../utils.dart';

class UserPage extends StatefulWidget {
  const UserPage({super.key, required this.storage});

  final CounterStorage storage;

  @override
  State<UserPage> createState() => UserPageState();
}

class UserPageState extends State<UserPage> {
  final supabase = Supabase.instance.client;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
        appBar: getAppBar(context, "Benutzer"),
        body: Column(
          children: [
            Card(
                child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ListTile(
                    // leading: Icon(Icons.album),
                    subtitle: Column(
                  children: [
                    Padding(
                        padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(children: [
                              Text("Benutzer"),
                            ]),
                            Column(children: [
                              Text(supabase?.auth?.currentUser?.email
                                      ?.toString() ??
                                  "Undefined"),
                            ]),
                          ],
                        )),
                    Padding(
                      padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(children: [
                            Text("Haushalt"),
                          ]),
                          Column(
                            children: [Text(Service.user.household)],
                          )
                        ],
                      ),
                    ),
                  ],
                )),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    const SizedBox(width: 8),
                    TextButton(
                      style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.resolveWith(
                              (states) => Colors.white)),
                      child: Text(
                        'LOGOUT',
                        style: TextStyle(color: MyThemes.primaryColor),
                      ),
                      onPressed: () async {
                        var snackbar = showNotification(context, "Logging out");
                        await logout();
                        snackbar.close();
                      },
                    ),
                  ],
                ),
                // StreamBuilder(
                //     stream: stream,
                //     builder: (context, snapshot) {
                //       return Text("tetst");
                //     })
              ],
            )),
            // Padding(
            //   padding: EdgeInsets.fromLTRB(10, 20, 10, 0),
            //   child: Row(
            //       mainAxisAlignment: MainAxisAlignment.spaceBetween,
            //       children: [
            //         Column(
            //           mainAxisAlignment: MainAxisAlignment.start,
            //           children: [Text("sad")],
            //         ),
            //         Column(
            //           mainAxisAlignment: MainAxisAlignment.end,
            //           children: [Text("asd")],
            //         )
            //       ]),
            // )
            // DataTable(
            //     headingRowHeight: 0,
            //     dividerThickness: 0.0,
            //     columns: <DataColumn>[
            //       DataColumn(label: Container()),
            //       DataColumn(label: Container()),
            //       DataColumn(label: Container()),
            //     ],
            //     rows: [
            //       DataRow(
            //         cells: <DataCell>[
            //         DataCell(Container(child: Text("dfs")
            //             // Text(wholeRecipe.recipe.number_of_people
            //             //     .toString()),
            //             )),
            //         DataCell(Text(" min")),
            //         DataCell(Text("ca"))
            //       ])
            //     ],

            //     ),
            //   FloatingActionButton(
            //     onPressed: () async => {
            //       await supabase.auth.signOut().then((value) {
            //         Navigator.pushNamedAndRemoveUntil(
            //             context, '/login', ModalRoute.withName('/'));
            //       })
            //     },
            //     child: Row(
            //       children: [
            //         Text("Logout"),
            //         Icon(Icons.logout),
            //       ],
            //     ),
            //     //   child: Row(children: [
            //     //     Text(
            //     //       "logout",
            //     //       style: TextStyle(fontSize: 18),
            //     //     ),
            //     //     Spacer(),
            //     //     Icon(Icons.logout)
            //     //   ], mainAxisAlignment: MainAxisAlignment.center),
            //   )
          ],
        )

        // SettingsList(
        //   sections: [
        //     SettingsSection(
        //       title: Text('Common'),
        //       tiles: <SettingsTile>[
        //         SettingsTile.switchTile(
        //           onToggle: (value) {},
        //           initialValue: true,
        //           leading: Icon(Icons.format_paint),
        //           title: Text('Enable custom theme'),
        //         ),
        //       ],
        //     ),
        //   ],
        // )
        );
  }

  logout() async {
    var user = supabase.auth.currentSession;
    if (user != null) {
      // User is authenticated, proceed with logout
      supabase.auth.signOut();
    } else {
      // User is not authenticated
      // console.log("User is not authenticated.");

      debugger();
    }

    await supabase.auth.signOut();
    Navigator.pushNamedAndRemoveUntil(
        context, '/login', ModalRoute.withName('/'));
    await SqfLiteHandler.deleteUser(0);
  }
}
