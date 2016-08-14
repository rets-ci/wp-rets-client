#!/usr/bin/env bash

sudo service nginx reload

echo $(date) "post-merge hook ran" >> /home/core/post-merge.log