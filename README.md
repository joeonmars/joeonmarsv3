This is the README.md for joeonmars: Joe on Mars v3

# URLs

    Live:            http://joeonmarsv3.com/
    Staging:         http://staging.joeonmarsv3.com/
    Local:           http://local.joeonmarsv3.com/ -> source/public/
    Local Release:   http://local-release.joeonmarsv3.com/ -> release/public/
    BR Staging:      http://jomv3.b-reel-staging.com/


# SoyTemplate Syntax Highlighting for Sublime Text 2:

cd ~/Library/Application\ Support/Sublime\ Text\ 2/Packages &&
git clone git://github.com/anvie/SoyTemplate.git SoyTemplate

In Sublime Text 2, Toolbar - View - Syntax - SoyTemplate


# Sublime Text 2 custom build system for project

"build_systems": [
	{
		"name": "Jomv3 Closure Template",
		"cmd": [
			"java", "-jar", "$project_path/utils/closure-templates-for-js/SoyToJsSrcCompiler.jar",
			"--outputPathFormat", "../${file_base_name}.js",
			"--shouldProvideRequireSoyNamespaces",
			"${file}"],
		"selector": "source.soy"
	},
	{
		"name": "Jomv3 Compass",
		"cmd": "cd '$project_path/source/scss'; compass watch",
		"working_dir": "$packages/Compass",
		"selector": "source.sass, source.scss",
		"shell": "true",
		"windows":
		{
			"cmd": ["compasswatch.bat", "$project_path"]
		}
	}
 ]