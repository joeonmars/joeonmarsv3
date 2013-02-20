import os
import subprocess

## AUTOMATED CONFIG
ROOT = '../source/public/assets/'

## MANUAL CONFIG
OUTPUT_FILE = ROOT + 'js/thirdparty.min.js'
INPUT_FILES = [
	'js/thirdparty/fastclick.js',
	'js/thirdparty/consoleshim.min.js',
	'js/thirdparty/modernizr_v2.6.2.js',
	'js/thirdparty/greensock/TweenMax.min.js',
	'js/thirdparty/createjs/preloadjs-0.3.0.min.js',
	'js/thirdparty/zynga-scroller/Animate.js',
	'js/thirdparty/zynga-scroller/Scroller.js'
]

INPUT_JS_STRING = ''
for jsfile in INPUT_FILES:
	INPUT_JS_STRING = INPUT_JS_STRING + ' --js ' + ROOT + jsfile 
print INPUT_JS_STRING
COMPRESS_CLOSURE_JAR = 'compiler.jar'
COMPRESS_CLOSURE_COMPILER_BINARY = 'java -jar %s %s --js_output_file %s' % (COMPRESS_CLOSURE_JAR, INPUT_JS_STRING, OUTPUT_FILE)

result = subprocess.check_output(COMPRESS_CLOSURE_COMPILER_BINARY, shell=True).splitlines()
for f in result:
    print '\t\t' + f