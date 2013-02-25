import os

def countFiles(_path, _file_format):
	num_files = 0
	num_lines = 0
	num_lines_blank = 0
	num_words = 0
	num_chars = 0
	num_comments = 0

	for r,d,f in os.walk(_path):
		for files in f:
			if _file_format.find('.') >= 0:
				file_match_msg = 'Files ending with '
				validFileMatch = files.endswith(_file_format)
			else:
				file_match_msg = 'Files containing '
				validFileMatch = files.find(_file_format) >= 0

			if validFileMatch:
				aFilePath = os.path.join(r ,files)
				aFile = open(aFilePath, 'r')
				num_lines_in_file = 0
				num_files += 1

				with aFile as aF:
					for line in aF:
						words = line.split()

						num_lines_in_file += 1
						num_lines += 1
						num_words += len(words)
						num_chars += len(line)

						#print len(line)
						if(len(line) <= 1):
							num_lines_blank += 1

						if(line.find('//') >= 0):
							num_comments += 1

						#print line
						#print aFilePath + ':' + str(num_lines_in_file)

	print '\n'
	print file_match_msg + _file_format
	print '------------------------'
	print 'Number of files: ' + str(num_files)
	print 'Number of lines: ' + str(num_lines)
	print 'Number of blank lines: ' + str(num_lines_blank)
	print 'Number of comments: ' + str(num_comments)
	print '\n'
	print 'Number of words: ' + str(num_words)
	print 'Number of charachters: ' + str(num_chars)
	print '------------------------'

countFiles('../source/js/jomv3/', '.js')
countFiles('../source/scss/', '.scss')
countFiles('../source/public/assets/images/', '@2x')