.PHONY: build
build: desires.png

desires.png: desires.dot
	dot -Tpng desires.dot -o desires.png

.PHONY: clean
clean:
	rm -f *.png
