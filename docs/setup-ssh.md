# Task #1 - setup ssh

one of the easier ways to work with git & github is ssh keys.

so before the task lets talk about ssh in the conext of github.

## Assumptions before starting

- we assume the use of macOS (presumably m1/m2/m3, but not so important at the moment).

- we assume the use of vscode as a code editor.

- we assume the use of a bash termianl (at least, if not zsh/oh-my-zsh). but it's all the same.

- we assume no further knowledge for this task.

## Side notes

this will be the 1st and only task you can not code in the repo.

## Some theory

### what is ssh ?

a cryptographic protocol to *securely* access and manage remote machines. ssh provides encrypted communication.

### how does it work

you need to use part of the OpenSSH suite to generate both public and private keys.

usign `ssh-keygen` you can generate your keys. which can then be found (by default)  under ~/.ssh/ on your machine (please don't change the destination).

you should copy the public key generated and input it into your github user account - in the releavnt place. 

ask me if you have any trouble with this.

et voila ! once you do so, you'll be able to clone this repo locally and get going !

## Task details

1. create ssh keys locally

    - open your terminal and run the following command: 

        `ssh-keygen -t ed25519 -C "<your_user_email@whatever.com>"`

    - you'll be promted for the destination of the keys, just press enter - allowing it go to the default path. (copy the path from the parenthesis and add to `id_ed25519` `_<some_meaningfull_name_for_your_keys>`)

    - you'll be prompted for a pass phrase. up to you - for ease of work i just leave a blank (press enter).

2. add ssh key to your ssh-agent

    - open your terminal and run the following command: 
        
        `eval "$(ssh-agent -s)"`
    
    - you'll seem something like this: `Agent pid <some_number>` (this is the process id on which the ssh agent is running in the background - what we call a daemon process).

    - make sure your'e keys exist in the ~/.ssh directory. open your terminal and run: `ls ~/.ssh/`. you should be able to see your key pair (both private and public)

    - finnally, add your key to the agent (the private one that does not end in .pub): `ssh-add ~/.ssh/_id_ed_25519_whatever_name_you_gave_the_keys`.


3. add the relevant ssh key (my_key.pub) to your github configuration (in the website).

    - run the following command: `cat ~/.ssh/id_ed25519__id_ed_25519_whatever_name_you_gave_the_keys.pub` then copy it to your clipboard (cmd + c)

    - pase it in github under : settings -> SSH and GPG Keys -> New SSH Key -> give it a name -> paste the key under : "Key".

4. clone the repo
    - go to [this repo](https://github.com/E1Duder1no/backend-101)

    - select the ssh option
    
4. clone the github repo - using the SSH option