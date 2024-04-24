---
title: 'Managing dotfiles'
description: 'A simple way to manage your dotfiles'
pubDate: '2021-12-23T20:48:59+05:30'
heroImage: '/dotfiles.jpg'
authour: 'gtlsgamr'
---

"Dotfiles" are a way to store configuration of various packages and programs on your system. They are named so because of the '*.*' that precedes their names to keep them hidden.

These dot files make up the system of a user and in case the system crashes into an unrecoverable state, the user might lose all their configurations for all of their programs. This is an inconvenience and can be easily avoided by managing your dotfiles properly. Many users online suggest using tools like [GNU stow](https://www.gnu.org/software/stow/) to manage and store the dotfiles but I personally prefer using the $HOME directory as a git repo. This is easier and doesn't require a special tool just to manage the dotfiles.

One issue with this method is the vast amount of extra files that exist in the $HOME directory. We are not doing any linking or copying, all the files will stay exactly where you want them to be. It can be solved by using a gitignore file which ignores everything. After that you can individually git add all the required files and once you add them manually, they will be tracked forever despite of the gitignore file.

## Instructions

- cd into your home directory.
- Create a new git repository

        $ git init     

- Create a git ignore file that ignores everything.

        $ echo '*' > .gitignore     

- Manually add all the files that you want to add to the repo by using.

        $ git add -f filename_or_directory_name     

(**Note: You can also add entire directories like ~/.config but make sure you don't include any of your private key files or config files with plaintext passwords by mistake. One such example is irssi config which may contain a plaintext password.**)

- Once that is done, commit your changes

        $ git commit -m 'commit message'    

- Add the remote origin url.

        $ git remote add origin http://yourgitrepo.com/username/reponame    

- Push the committed changes and set the upstream branch.

        $ git push --set-upstream origin master    

**Congratulations!** You managed to backup your dotfiles to a git repository. Now any time you update a dotfile, make sure you push the changes to the repo as well.

If you need to restore your dotfiles to a fresh system follow the instructions below:

- cd into your home directory.
- Clone the dotfiles repository to any directory.

        $ git clone http://yourgitrepo.com/username/reponame    

- cd into that directory, and copy all the contents to the home directory.

        $ cp -r .[!.]* $HOME/     

(**We are doing this so that any current dotfiles might be replaced**)
- Done!

It is not very ideal in terms of restoration, but it works and that's all that matters. No symlinking or hacky stuff. Just a repo to love and maintain. <3