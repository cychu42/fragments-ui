import { Auth, getUser } from './auth';
import {
  getUserFragments,
  postFragment,
  deleteFragment,
  getByIdFragments,
  updateFragment,
} from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postTextBtn = document.querySelector('#postTextBtn');
  const postImgBtn = document.querySelector('#postImgBtn');
  const getBtn = document.querySelector('#getBtn');
  const getByIdBtn = document.querySelector('#getByIdBtn');
  const updateTextBtn = document.querySelector('#updateTextBtn');
  const updateImgBtn = document.querySelector('#updateImgBtn');
  const deleteBtn = document.querySelector('#deleteBtn');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Handle post text button click
  postTextBtn.onclick = async () => {
    const text = document.getElementById('postText').value;
    const type = document.getElementById('postType').value;

    // post request to create a fragment
    document.getElementById('result').innerHTML = await postFragment(user, text, type);
  };

  // Handle post image button click
  postImgBtn.onclick = async () => {
    let image = document.getElementById('postImg').files[0];
    console.log(image);
    const type = document.getElementById('postType').value;

    // post request to create a fragment
    document.getElementById('result').innerHTML = await postFragment(user, image, type);
  };

  //  Handle get button click
  getBtn.onclick = async () => {
    // Do an authenticated request to the fragments API server and get the result
    // Get user's existing fragments' metadata
    document.getElementById('result').innerHTML = await getUserFragments(user);
  };

  //  Handle getByIdBtn button click
  getByIdBtn.onclick = async () => {
    const id = document.getElementById('getId').value;
    // Do an authenticated request to the fragments API server and get the result
    // Get the existing fragment's data
    await getByIdFragments(user, id);
  };

  //  Handle update text button click
  updateTextBtn.onclick = async () => {
    const text = document.getElementById('updateText').value;
    const type = document.getElementById('updateType').value;
    const id = document.getElementById('updateId').value;

    // Do an authenticated request to the fragments API server and get the result
    document.getElementById('result').innerHTML = await updateFragment(user, text, type, id);
  };

  // Handle update image button click
  updateImgBtn.onclick = async () => {
    const image = document.getElementById('updateImg').value;
    const type = document.getElementById('updateType').value;
    const id = document.getElementById('updateId').value;

    // post request to create a fragment
    document.getElementById('result').innerHTML = await postFragment(user, image, type, id);
  };

  //  Handle get button click
  deleteBtn.onclick = async () => {
    const id = document.getElementById('deleteId').value;
    // Do an authenticated request to the fragments API server and get the result
    document.getElementById('result').innerHTML = await deleteFragment(user, id);
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
