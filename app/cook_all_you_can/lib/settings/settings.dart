import 'package:flutter/material.dart';
import 'package:settings_ui/settings_ui.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  final supabase = Supabase.instance.client;

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
        appBar: AppBar(
            title: Text('Einstellungen'), backgroundColor: Colors.grey[700]),
        body: Container(
          child: Text("Not implemented"),
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
