# Documentation GitHub AREA project

## Methodology

We are using the Agile methodology for our project workflow.

## Branching

For each task, a separate branch should be created. After completion, it should be merged back into the parent branch. The hierarchy of branches is as follows:

* Task Branch
* Parent Branch (Back-end or Front-end)
* Dev Branch
* Main Branch

### Checklist for Branching

* [ ] Create a separate branch for each task.
* [ ] After completion, merge it back into the parent branch.
* [ ] Keep the parent branches (Back-end or Front-end) up to date.
* [ ] Once the parent branches are up to date, merge them into the Dev branch.
* [ ] When the Dev branch is stable, merge it into the Main branch. #branching

### Sub Checklist for Merging

* [ ] Resolve any merge conflicts.
* [ ] Ensure all tests pass after merging.
* [ ] Notify the team after a successful merge.

## Commits

Every commit message should start with [ADD], [FIX], or [DEL] to denote the nature of the commit.

### Checklist for Commits

* [ ] Ensure every commit message starts with [ADD], [FIX], or [DEL].
* [ ] The commit message should be clear and descriptive. #committing

## General Guidelines

* Always keep your branches up to date.
* Regularly pull from the parent branches.
* Always check your code before committing.
* Commit often with clear messages.
* Merge frequently to avoid large merge conflicts.

## Numbered Steps for Task Completion

1. Pull the latest changes from the parent branch.
2. Create a new branch for your task.
3. Work on your task in this new branch.
4. Regularly commit your changes with clear, descriptive messages.
5. Once the task is completed, merge your task branch back into the parent branch.
6. Pull the latest changes from the parent branch into the Dev branch.
7. Merge the parent branch into the Dev branch.
8. Once the Dev branch is stable, merge it into the Main branch. #task-completion

## Git Commands List

1. Clone a remote repository onto your local machine.

    ```bash
    git clone <url>
    ```

2. Create a new branch.

    ```bash
    git branch <branch_name>
    ```

3. Switch to another branch.

    ```bash
    git checkout <branch_name>
    ```

4. Add all modified files to the index.

    ```bash
    git add .
    ```

5. Make a commit with a descriptive message.

    ```bash
    git commit -m "[ADD] Added a new feature"
    ```

6. Make a commit for a bug fix.

    ```bash
    git commit -m "[FIX] Bug fix"
    ```

7. Make a commit for a feature deletion.

    ```bash
    git commit -m "[DEL] Deleted a feature"
    ```

8. Push the commits from your branch to the remote repository.

    ```bash
    git push origin <branch_name>
    ```

9. Fetch the latest changes from the remote repository to your local branch.

    ```bash
    git pull
    ```

10. Merge another branch into your current branch.

    ```bash
    git merge <branch_name>
    ```
