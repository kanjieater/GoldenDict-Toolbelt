#!/usr/bin/python3
import urllib.request
import urllib.parse
import sys
from lxml.html import fromstring, tostring
import re


"""
Arguments: url
           select_div             class attribute of the selected part 
                                   (used only in output, not for actual selection)
           select_xpath           xpath of the elements that will be output 
                                   (leave empty for outputting whole page)
           css_file               file in the same dir as this script
           elements_for_removal   array of xpath addresses, 
                                    e.g. ['//div[@class="copyright"]','//input','//img']
           values_for_javascript  (optional) hash of 'key': 'value' pairs
"""

def get_page():
    if len(sys.argv)==7:
      values = eval(sys.argv[6])
      data = urllib.parse.urlencode(values).encode('utf8')
      request = urllib.request.Request(url, data)
    else:
      request = urllib.request.Request(url)
    response = urllib.request.urlopen(request)
    html = response.read()
    response.close()
    return html

def remove(el):
    el.getparent().remove(el)

url = urllib.parse.quote(sys.argv[1],':?/=&#;')
select_div = sys.argv[2]
select_xpath = sys.argv[3]
css_file = sys.argv[4]
if css_file.endswith('.css'):
  css_file = css_file[:-4]
#print("ELEMENTS FOR REMOVAL:"+sys.argv[5])
elements_for_removal = eval(sys.argv[5])
#print("URL: "+url)
#print("class: "+select_div)
#print("select_xpath: "+select_xpath)
#print("CSS_FILE: "+css_file)
#print("ELEMENTS FOR REMOVAL:"+elements_for_removal)
try:
  html = get_page()
  page = fromstring(html.decode('utf8','ignore'))
  page.make_links_absolute(base_url=url)
  baseurl = url.split("#",2)

  for address in elements_for_removal:
    for element in page.xpath(address):
      remove(element)

  print('<!DOCTYPE html>')
  print('<html><head><meta charset="utf-8">')
  if not css_file=='':
    print('<link rel="stylesheet" type="text/css" href="file:///home/ansa/bin/Goldendict/'+css_file+'.css"></head><body><div class="'+css_file+'"><div class="'+select_div+'">')
  else:
    print('</head><body><div><div class="'+select_div+'">')
  if not select_xpath=='':
    if not page.findall(select_xpath)==[]:
      for element in page.findall(select_xpath):
        print(tostring(element).decode('utf8').replace(baseurl[0]+"#","#") )
    else:
      print("Nothing found.")
  else:
    print(tostring(page).decode('utf8').replace(baseurl[0]+"#","#") )
  print('</div></div></body></html>')

except urllib.error.HTTPError as e:
  print('Downloading the page '+url+' failed with error code %s.' % e.code)