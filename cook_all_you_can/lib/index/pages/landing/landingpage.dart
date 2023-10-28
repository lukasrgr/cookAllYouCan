import 'package:cook_all_you_can/index/pages/shared/utils.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Home extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Home> {
  final supabase = Supabase.instance.client;

  @override
  initState() {
    // updateRecipes();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    return Scaffold(
      body: SingleChildScrollView(
          child: Padding(
        padding: EdgeInsets.fromLTRB(5, 10, 5, 0),
        child: Column(
          children: [
            Card(
              child: SizedBox(
                width: mediaQuery.size.width / 2,
                height: 100,
                child: Column(
                  children: [Text("Meal")],
                ),
              ),
            ),
          ],
        ),
      )),
    );
  }
}
