import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

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
  late final userData;
  var some;

  var stream;

  @override
  void initState() {
    // stream =
    //     supabase.from('recipe').stream(primaryKey: ['id']).listen((event) {});
    // supabase.channel('public:recipe').on(
    //   RealtimeListenTypes.postgresChanges,
    //   ChannelFilter(event: 'INSERT', schema: 'public', table: 'recipe'),
    //   (payload, [ref]) {
    //     // text.add(Text("Test ${payload.toString}"));
    //     print("WQork ------------------");
    //     print('Change received: ${payload.toString()}');
    //   },
    // );
    super.initState();
  }

  // List<Text> some() {
  //   List<Text> text = [];
  //   supabase.channel('public:recipe').on(
  //     RealtimeListenTypes.postgresChanges,
  //     ChannelFilter(event: 'INSERT', schema: 'public', table: 'recipe'),
  //     (payload, [ref]) {
  //       // text.add(Text("Test ${payload.toString}"));
  //       print('Change received: ${payload.toString()}');
  //     },
  //   ).subscribe();

  //   return text;
  // }

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
                    title: Text("Benutzer"),
                    subtitle: Column(
                      children: [
                        Padding(
                            padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                            child: Row(
                              children: [
                                Text(supabase?.auth?.currentUser?.email
                                        ?.toString() ??
                                    "Undefined"),
                              ],
                            )),
                        // Padding(
                        //   padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                        //   child: Row(
                        //     children: [
                        //       Text(supabase.auth.currentUser!..toString()),
                        //     ],
                        //   ),
                        // ),
                      ],
                    )),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    const SizedBox(width: 8),
                    TextButton(
                      child: Text(
                        'LOGOUT',
                        style: TextStyle(color: primaryColor),
                      ),
                      onPressed: () async {
                        var snackbar = showNotification(context, "Logging out");
                        await supabase.auth.signOut().whenComplete(() {
                          saveDataOnDevice("email", "");
                          saveDataOnDevice("password", "");
                          snackbar.close();
                          Navigator.pushNamedAndRemoveUntil(
                              context, '/login', ModalRoute.withName('/'));
                        });
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
}
