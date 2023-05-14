import 'package:flutter/material.dart';

class BasicAlertDialog extends StatelessWidget {
  String text = "";
  BasicAlertDialog(String text, {super.key}) {
    this.text = text;
  }

  @override
  Widget build(BuildContext context) {
    // Scaffold is a layout for
    // the major Material Components.

    return AlertDialog(
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(text),
          ],
        ),
      ),
      actions: <Widget>[
        Row(
          children: [
            Column(
              children: [
                TextButton(
                  child: const Text('Ja'),
                  onPressed: () {
                    Navigator.of(context).pop(true);
                  },
                ),
              ],
            ),
            Spacer(),
            Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  child: const Text('Nein'),
                  onPressed: () {
                    Navigator.of(context).pop(false);
                  },
                ),
              ],
            )
          ],
        )
      ],
    );
  }
}
