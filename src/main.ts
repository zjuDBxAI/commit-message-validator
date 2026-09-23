import * as core from '@actions/core';
import * as github from '@actions/github';
import {PullRequestEvent, PushEvent, Commit} from '@octokit/webhooks-types';
import validate from './validator';
import {parseMessage, CommitMessage} from './commitMessage';
import {getConfig} from './config';
import {getSetting, ISetting} from './settings';

/**
 * extract commit messages based on the trigger event
 *
 * @param eventName trigger event name
 * @returns string array of commit messages
 */
async function getCommitMessages(eventName: string): Promise<string[]> {
  core.debug(`Event name: ${eventName}`);
  if (eventName === 'pull_request') {
    const prEvent = github.context.payload as PullRequestEvent;
    const octokit = github.getOctokit(
      core.getInput('github-token', {required: true}),
    );
    const commits = await octokit.paginate(octokit.rest.pulls.listCommits, {
      ...github.context.repo,
      pull_number: prEvent.pull_request.number,
      per_page: 100,
    });
    return commits.map(commit => commit.commit.message);
  } else if (eventName === 'push') {
    const pushEvent = github.context.payload as PushEvent;
    const commits: Commit[] = pushEvent.commits;
    return commits.map(commit => commit.message);
  } else {
    throw new Error(`This action does not support the event ${eventName}`);
  }
}

async function run(): Promise<void> {
  try {
    const setting: ISetting = getSetting();
    const config = getConfig(setting);
    const commitMessages = await getCommitMessages(github.context.eventName);
    commitMessages.forEach(message => {
      const commitMessage: CommitMessage = parseMessage(message);
      core.debug(`Commit message: ${JSON.stringify(commitMessage)}`);
      validate(commitMessage, config);
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed with error ${error.stack}`);
    } else {
      core.setFailed('Action failed without an error');
    }
  }
}

run();
