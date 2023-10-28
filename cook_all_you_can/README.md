# cook_all_you_can

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

- TODO's:
    - Pagination
    - Nutrition score
    - Elastic Search
    - Categories
    - Readjust recipes list
    - user input feedback in general
    - add image to recipe
    - refresh possibility
    - Change queries to GraphiQL
    - expandable for shoppinglist[s]
    - Comment field on recipe
    - Push Notifications

    * DONE:
        - Github Pages (improve performance)
        - editRecipe
        - Fulltextsearch

    * Backlog:
        - Filter (rating, name, time)
        - zutaten alle in eine liste und automatische Trennung
        - Rating, specific for households
        - Demo-Login

- Features:
    - Animations: https://pub.dev/packages/animations
    - Local notification: https://pub.dev/packages/flutter_local_notifications
    - Slidable: (Used for listitem, to interact without popup) https://pub.dev/packages/flutter_slidable
    - flutter native splash: https://pub.dev/packages/flutter_native_splash
    - pull_to_refresh: https://pub.dev/packages/pull_to_refresh


     // SvgPicture.asset(
                          //     'assets/images/logo_with_new_color.svg',
                          //     colorFilter:
                          //         ColorFilter.mode(Colors.red, BlendMode.srcIn),
                          //     semanticsLabel: 'A red up arrow'),
                          // SvgPicture.asset(
                          //   'assets/images/logo_with_new_color.svg',
                          //   height: 20.0,
                          //   width: 20.0,
                          //   color: MyThemes.primaryColor,
                          //   theme:
                          //       SvgTheme(currentColor: MyThemes.primaryColor),
                          //   // allowDrawingOutsideViewBox: true,
                          // ),

- Changing flutter launch icon:
    - pubspec.yaml -> flutter_launch_icons
    - flutter pub get
    - flutter pub pub run flutter_launcher_icons:main
    - continue

- Improve Performance in web view:
    - flutter build web --web-renderer canvaskit