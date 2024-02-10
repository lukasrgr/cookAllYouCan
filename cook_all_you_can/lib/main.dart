// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'dart:async';

import 'package:cook_all_you_can/index/login.dart';
import 'package:cook_all_you_can/index/pages/overview/overview.dart';
import 'package:cook_all_you_can/index/pages/shared/settings/settings.dart';
import 'package:cook_all_you_can/index/pages/shared/settings/theme/theme.dart';
import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:cook_all_you_can/index/pages/shared/user/user.dart';
import 'package:cook_all_you_can/index/pages/shoppinglist/shoppinglist.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'index/index.dart';

StreamController<bool> isThemeChanging = StreamController();

Future<void> main() async {
  await mainConfiguration();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<bool>(
        initialData: true,
        stream: isThemeChanging.stream,
        builder: (context, snapshot) {
          return MaterialApp(
            title: 'Cook All You Can',
            home: LoginDemo(storage: CounterStorage()),
            theme: MyThemes.customTheme,
            initialRoute: '/',
            routes: {
              '/details': (context) => const ShoppingList(),
              '/settings': (context) => const Settings(),
              '/overview': (context) => Overview(),
              '/login': (context) => LoginDemo(
                    storage: CounterStorage(),
                  ),
              '/user': (context) => UserPage(
                    storage: CounterStorage(),
                  ),
              '/index': (context) => Index(),
            },
          );
        });
  }
}

mainConfiguration() async {
  await Supabase.initialize(
    url: 'https://uxijslvfkmufudrbuyct.supabase.co',
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aWpzbHZma211ZnVkcmJ1eWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc5NjY1ODksImV4cCI6MTk5MzU0MjU4OX0.pO0HBzT9tPUqDgI7lmIa8n7UUc0YNvzaOmj7YFwc0kA',
  );

  // sqfliteFfiInit();

  // databaseFactory = databaseFactoryFfi;
  WidgetsFlutterBinding.ensureInitialized();

  const DB_VERSION = 3;

// Open the database and store the reference.
  final database = openDatabase(
    // Set the path to the database. Note: Using the `join` function from the
    // `path` package is best practice to ensure the path is correctly
    // constructed for each platform.
    join(await getDatabasesPath(), 'user_database.db'),
    version: DB_VERSION,

    onCreate: (db, version) async {
      // Run the CREATE TABLE statement on the database.
      return db.execute(
        'CREATE TABLE User(id INTEGER PRIMARY KEY, userName TEXT, password TEXT,household TEXT,household_id INTEGER)',
      );
    },
  );
}
