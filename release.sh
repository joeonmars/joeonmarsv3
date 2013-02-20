#!/bin/sh

# Sync from source to release
rsync -va source/public release/

# Remove JS source symlink
rm release/public/assets/js/source

# Main compile closure
utils/google-closure/closure/bin/build/closurebuilder.py \
	--root=source/js/jomv3/ \
	--root=utils/breel-commons/breel-js/ \
	--root=utils/google-closure/ \
	--namespace="jomv3.main" \
	--output_mode=compiled \
	--compiler_jar=utils/compiler.jar \
	> release/public/assets/js/main.js


# Unsupported compile closure
utils/google-closure/closure/bin/build/closurebuilder.py \
	--root=source/js/jomv3/ \
	--root=utils/breel-commons/breel-js/ \
	--root=utils/google-closure/ \
	--namespace="jomv3.unsupported" \
	--output_mode=compiled \
	--compiler_jar=utils/compiler.jar \
	> release/public/assets/js/unsupported.js