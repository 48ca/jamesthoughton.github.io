.PHONY: all clean

curriculum-redesign.pdf: curriculum-redesign.ms
	groff -ms curriculum-redesign.ms -Tpdf > curriculum-redesign.pdf

clean:
	$(RM) *.pdf
