import 'package:flutter/material.dart';

class Button extends StatelessWidget {
  const Button({super.key});

  @override
  Widget build(BuildContext context) {
    // Scaffold is a layout for
    // the major Material Components.
    return Scaffold(
      // body is the majority of the screen.
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          Text("Add a new Recipe",
              style: Theme.of(context).textTheme.subtitle1),
          const IconButton(onPressed: null, icon: Icon(Icons.add_box)),
          Text(
            "some",
          )
        ],
      )),
    );
  }
}
