// Copyright 2018 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'dart:async';

import 'package:cook_all_you_can/index/overview/overview.dart';
import 'package:cook_all_you_can/index/overview/shared/settings/theme/theme.dart';
import 'package:cook_all_you_can/index/overview/shared/settings/settings.dart';
import 'package:cook_all_you_can/index/login.dart';
import 'package:cook_all_you_can/index/overview/shared/shared.dart';
import 'package:cook_all_you_can/index/overview/shoppinglist/shoppinglist.dart';
import 'package:cook_all_you_can/index/overview/shared/user/user.dart';
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

StreamController<bool> isThemeChanging = StreamController();

Future<void> main() async {
  await Supabase.initialize(
    url: 'https://uxijslvfkmufudrbuyct.supabase.co',
    // TODO user
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aWpzbHZma211ZnVkcmJ1eWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc5NjY1ODksImV4cCI6MTk5MzU0MjU4OX0.pO0HBzT9tPUqDgI7lmIa8n7UUc0YNvzaOmj7YFwc0kA',
  );
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
              // '/': (context) => Homescreen(),
              '/details': (context) => const ShoppingList(),
              '/settings': (context) => const Settings(),
              '/overview': (context) => Overview(),
              '/login': (context) => LoginDemo(
                    storage: CounterStorage(),
                  ),
              '/user': (context) => UserPage(
                    storage: CounterStorage(),
                  ),
            },
          );
        });
  }
}
