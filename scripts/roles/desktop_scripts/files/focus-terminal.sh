#! /bin/sh

wmctrl -i -a $(wmctrl -l | grep '#' | head -c10)
