## SPDX-License-Identifier: CC-BY-4.0

export LC_ALL=C
export LANGUAGE=C
export LANG=C

POSTS := $(wildcard posts/*.md)
POSTS_XML := $(patsubst posts/%.md,html/post.%.xml,$(POSTS))
POSTS_HTML := $(patsubst posts/%.md,html/post.%.html,$(POSTS))

html/post.%.xml: posts/%.md
	truncate -s 0 $@
	printf "<article data-sblg-article=\"1\"" >> $@
	printf " data-sblg-tags=\"`lowdown -X tags $<`\"" >> $@
	printf " data-sblg-title=\"`lowdown -X title $<`\"" >> $@
	printf " data-sblg-author=\"`lowdown -X author $<`\"" >> $@
	printf " data-sblg-datetime=\"`lowdown -X datetime $<`\"" >> $@
	printf " data-sblg-aside=\"`lowdown -X aside $<`\">" >> $@
	lowdown $< >> $@
	printf "</article>" >> $@

html/index.html: $(POSTS_XML) template.index.xml template.post.xml
	sblg -s cmdline -t template.post.xml -L $(POSTS_XML)
	sblg -s rcmdline -t template.index.xml -o $@ $(POSTS_XML)

all: html/index.html

clean:
	rm -vf $(POSTS_XML)

distclean:
	rm -vf $(POSTS_XML)
	rm -vf $(POSTS_HTML)
	rm -vf html/index.html
