#!/bin/sh

# make sure that node exists
node=`which node 2>&1`
ret=$?
if [ $ret -eq 0 ] && [ -x "$node" ]; then
  (exit 0)
else
  echo "This build system requires Node.js." >&2
  echo "Install node first, and then try again." >&2
  echo "http://nodejs.org/" >&2
  echo "" >&2
  echo "Maybe node is installed, but not in the PATH?" >&2
  echo "Note that running as sudo can change envs." >&2
  echo ""
  echo "PATH=$PATH" >&2
  exit $ret
fi

node source/js/{__PROJ_NS__}/build/build.js $*