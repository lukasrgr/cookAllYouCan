# cook_all_you_can
## Basics

"Cook All You Can" resembles a cook book app, that includes features from creating and updating recipes to be able to organize your meals and get an auto generated shopping list.
Main goal was to create a app with flutter without having to build a backend. For this purpose the Supabase (Firebase cost free alternative) with its integrated postgres database was used.

## Programming language and environment

| Component | Programming Language 
| --- | ----------- |
| Database | Postgres
| Backend | Supabase API
| Frontend | Flutter with Dart


- TODO's:
    - Pagination
    - Nutrition score
    - Elastic Search
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
        - editing recipes
        - Fulltextsearch
        - Categories
        - Households

    * Backlog:
        - Filter (rating, name, time)
        - Rating, specific for households
        - Demo-Login

- Features:
    - Animations: https://pub.dev/packages/animations
    - Local notification: https://pub.dev/packages/flutter_local_notifications
    - Slidable: (Used for listitem, to interact without popup) https://pub.dev/packages/flutter_slidable
    - flutter native splash: https://pub.dev/packages/flutter_native_splash
    - pull_to_refresh: https://pub.dev/packages/pull_to_refresh

- Changing flutter launch icon:
    - pubspec.yaml -> flutter_launch_icons
    - flutter pub get
    - flutter pub pub run flutter_launcher_icons:main
    - continue

- Improve Performance in web view:
    - flutter build web --web-renderer canvaskit

new logo: flutter pub pub run flutter_launcher_icons:main
