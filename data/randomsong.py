import random
l = open('songs.txt').readlines()
print l[int(random.random()*len(l))]
