export TZ=UTC
export LC_ALL=C
export LANGUAGE=C
export LANG=C

POSTS_MD := $(wildcard posts/*.md)
POSTS_XML := $(patsubst posts/%.md,posts/%.xml,${POSTS_MD})
POSTS_HTML := $(patsubst posts/%.md,posts/%.html,${POSTS_MD})

posts/%.xml: posts/%.md
	truncate -s 0 $@
	printf "<article data-sblg-article=\"1\">" >> $@
	printf "<meta data-sblg-tags=\"`lowdown -X tags $<`\"/>" >> $@
	printf "<meta data-sblg-title=\"`lowdown -X title $<`\"/>" >> $@
	printf "<meta data-sblg-aside=\"`lowdown -X aside $<`\"/>" >> $@
	lowdown --html-no-skiphtml --html-no-escapehtml $< >> $@
	printf "</article>" >> $@

index.html: ${POSTS_XML} index.xml post.xml
	sblg -s cmdline -t post.xml -L ${POSTS_XML}
	sblg -s rcmdline -t index.xml -o $@ ${POSTS_XML}

all: index.html

clean:
	rm -vf ${POSTS_XML}

distclean:
	rm -vf ${POSTS_XML}
	rm -vf ${POSTS_HTML}
	rm -vf index.html
