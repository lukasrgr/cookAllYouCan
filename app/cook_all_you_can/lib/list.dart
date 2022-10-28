import 'package:flutter/material.dart';

class List extends StatelessWidget {
  const List({super.key});

  @override
  Widget build(BuildContext context) {
    // Scaffold is a layout for
    // the major Material Components.
    return Scaffold(
      appBar: AppBar(
          // leading: const IconButton(
          //   icon: Icon(Icons.menu),
          //   tooltip: 'Navigation menu',
          //   onPressed: null,
          // ),
          // title: const Text('Example title'),
          // actions: const [
          //   IconButton(
          //     icon: Icon(Icons.search),
          //     tooltip: 'Search',
          //     onPressed: null,
          //   ),
          // ],
          ),
      // body is the majority of the screen.
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          const Text("Add a new Recipe"),
          const IconButton(onPressed: null, icon: Icon(Icons.add_box)),
          const Text("some")
        ],
      )),
      floatingActionButton: const FloatingActionButton(
        tooltip: 'Add', // used by assistive technologies
        onPressed: null,
        child: Icon(Icons.add),
      ),
    );
  }
}
