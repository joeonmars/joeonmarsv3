#!/bin/bash

### FUNCTIONS ###

promptyn () {
	while true; do
		read -p "$1 (yes, no) " yn
		case $yn in
			[Yy]* ) RETURN_VALUE="yes"; return 0;;
			[Nn]* ) RETURN_VALUE="no"; return 1;;
			* ) echo "Please answer [y]es or [n]o."; exit;
		esac
	done
}

promptstr () {
	read -p "$1 " RETURN_VALUE
	return
}

promptns () {
	while true; do
		read -p "$1 " str
		RETURN_VALUE=$str
		return
	done
}

promptdomain () {
	while true; do
		read -p "$1 " domain
		RETURN_VALUE=$domain
		return
	done
}

processtemplate () {
	if [[ $1 =~ (js|php|html|txt|md|as|ini|json|xml|htaccess|conf|gitignore|sh)$ ]]; then
		sed -i .bak -e "s/{__PROJ_CLIENT__}/$PROJ_CLIENT/g" $1 && rm "$1.bak"
		sed -i .bak -e "s/{__PROJ_NAME__}/$PROJ_NAME/g" $1 && rm "$1.bak"
		sed -i .bak -e "s/{__PROJ_NS__}/$PROJ_NS/g" $1 && rm "$1.bak"
		sed -i .bak -e "s/{__PROJ_DOMAIN__}/$PROJ_DOMAIN/g" $1 && rm "$1.bak"
	fi
}

### RUN ###

# 1. Prerequisites

# 2. Project details

PROJ_CLIENT="Client"
PROJ_NAME="Example Project"
PROJ_NS="example"
PROJ_DOMAIN="example.com"

PROMPT_FOR_DETAILS=true
while $PROMPT_FOR_DETAILS; do
	promptstr "Enter the client name (e.g. Google):"
	PROJ_CLIENT=$RETURN_VALUE

	promptstr "Enter the project name (e.g. The Wilderness Downtown):"
	PROJ_NAME=$RETURN_VALUE

	promptns "Enter the project namespace. (a-z, short, e.g. wilderness):"
	PROJ_NS=$RETURN_VALUE

	promptdomain "Enter a URL for this project (e.g. thewildernessdowntown.com):"
	PROJ_DOMAIN=$RETURN_VALUE

	echo "      Project Name: $PROJ_CLIENT: $PROJ_NAME"
	echo " Project Namespace: $PROJ_NS.*"
	echo "       Project URL: http://$PROJ_DOMAIN/"

	if promptyn "Are the details you entered correct?"; then
		break
	fi
done

# 3. Generate

declare -a PATH_PARTS

if [ "$#" -eq 1 ];
	then ASSETS_DIR=$1;
	else ASSETS_DIR="assets/";
fi

while read LINE; do
	# Determine depth
	[[ $LINE =~ ^(\>*)(.*)$ ]]
	DEPTH=${#BASH_REMATCH[1]}
	LINE=${BASH_REMATCH[2]}

	# Determine chmod options
	HAS_CHMOD_OPTIONS=false
	CHMOD_OPTIONS=
	if [[ $LINE =~ ^(.*)\ \[(.+)\]$ ]]; then
		HAS_CHMOD_OPTIONS=true
		CHMOD_OPTIONS=${BASH_REMATCH[2]}
		LINE=${BASH_REMATCH[1]}
	fi

	# Determine action and content 
	if [[ $LINE =~ ^(.+)\ \-\>\ (.+)$ ]]; then
		PATH_PART=${BASH_REMATCH[1]}
		SYMLINK_DESTINATION=${BASH_REMATCH[2]}
		ACTION="symlink"
	elif [[ $LINE =~ ^(.+\/)$ ]]; then
		PATH_PART=${BASH_REMATCH[1]}
		ACTION="directory"
	elif [[ $LINE =~ ^(.+)$ ]]; then
		PATH_PART=${BASH_REMATCH[1]}
		ACTION="template"
	fi

	# Determine full path
	PATH_PARTS[$DEPTH]=$PATH_PART
	PATH_SLICE=${PATH_PARTS[@]:0:$DEPTH}
	CONTAINING_PATH=$(echo ${PATH_SLICE[*]} | sed 's: ::g')
	FILENAME=${PATH_PARTS[$DEPTH]}
	FULL_PATH="${CONTAINING_PATH}${FILENAME}"

	# Substitute __PROJ_NS__ in path part
	FULL_PATH_SUBBED=$(sed "s:__PROJ_NS__:$PROJ_NS:g" <<< $FULL_PATH)
	CONTAINING_PATH_SUBBED=$(sed "s:__PROJ_NS__:$PROJ_NS:g" <<< $CONTAINING_PATH)
	FILENAME_SUBBED=$(sed "s:__PROJ_NS__:$PROJ_NS:g" <<< $FILENAME)

	if $HAS_CHMOD_OPTIONS
	then EXTRA=" $(tput setaf 4)$CHMOD_OPTIONS$(tput sgr0)"
	else EXTRA=""
	fi

	case $ACTION in

		directory)
			echo "+ $CONTAINING_PATH_SUBBED$(tput setaf 6)$FILENAME_SUBBED$(tput sgr0)$EXTRA"
			mkdir -p $FULL_PATH_SUBBED
			;;

		symlink)
			echo "+ $CONTAINING_PATH_SUBBED$(tput setaf 6)$FILENAME_SUBBED$(tput sgr0) -> $(tput setaf 5)$SYMLINK_DESTINATION$(tput sgr0)"
			[ -e $FULL_PATH_SUBBED ] && rm $FULL_PATH_SUBBED
			ln -s $SYMLINK_DESTINATION $FULL_PATH_SUBBED
			;;

		template)
			TEMPLATE_FILE_NAME="$ASSETS_DIR$(sed "s:/:_:g" <<< $FULL_PATH)"
			echo "+ $CONTAINING_PATH_SUBBED$(tput setaf 1)$(tput bold)$FILENAME_SUBBED$(tput sgr0)$EXTRA"
			if [ -e $TEMPLATE_FILE_NAME ]; then
				cp $TEMPLATE_FILE_NAME $FULL_PATH_SUBBED
				processtemplate $FULL_PATH_SUBBED
			else
				echo "Warning: Couldn't find template at $TEMPLATE_FILE_NAME"
				touch $FULL_PATH_SUBBED
			fi
			;;

	esac

	if $HAS_CHMOD_OPTIONS
	then chmod $CHMOD_OPTIONS $FULL_PATH_SUBBED
	fi

	# echo "$ACTION: $FULL_PATH"
done < "${ASSETS_DIR}basic-structure.txt"

# 4. Download Closure

echo "Downloading latest version of Google Closure from SVN..."
svn export http://closure-library.googlecode.com/svn/trunk/ utils/google-closure
