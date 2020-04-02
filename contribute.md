To contribute to the N.A. Cleantime Calculator, fork, make your changes and send a pull request to the master branch.

Take a look at the issues for bugs that you might be able to help fix.

Once your pull request is merged it will be released in the next version.

To get things going in your local environment.

`docker-compose up`

Get your wordpress installation going.  Remember your admin password.  Once it's up, login to admin and activate the "NACC WordPress Plugin" plugin.

Now you can make edits to the nacc-wordpress-plugin.php file and it will instantly take effect.

Please make note of the .editorconfig file and adhere to it as this will minimise the amount of formatting errors.  If you are using PHPStorm you will need to install the EditorConfig plugin.


#Tagging

If a release is tagged with `beta`, it will be pushed to a zip in Github release.  If it's not then it will go to the wordpress directory as a release in addition to the latter.
