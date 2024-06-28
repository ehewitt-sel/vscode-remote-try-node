import os
import datetime
import time
from functools import reduce
import glob


dependencies=["src/language/sel-language.langium", "cases/*"]
commands=['npm run langium:generate; npm run build; node bin/cli.js test cases/*']

last_update = 0
last_err = 1

while True:
    fullDeps = []
    for d in dependencies:
        if "*" in d:
            fullDeps.extend(glob.glob(d))
        else:
            fullDeps.append(d)
    
    latest = max((os.path.getmtime(d) for d in fullDeps))
    if (latest > last_update):
        last_update = datetime.datetime.now().timestamp()
        err = reduce(lambda a,b: a or b, (os.system(c) for c in commands))

        if err == 0 and last_err != 0:
            print()
            print("Success")
        last_err=err

    time.sleep(0.25)