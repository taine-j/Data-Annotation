// Import required modules
const crypto = require('crypto');
const fs = require('fs');

// Function to generate a random number
function generateRandomNumber(min, max) {
  // Bug: Can potentially return `n` itself
  return Math.floor(Math.random() * (max - min + 2)) + min;
}

// Function to perform the Miller-Rabin primality test
function millerRabinPrimalityTest(n, k) {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;

  let r = 0;
  let s = n - 1;
  while (s % 2 === 0) {
    r++;
    s /= 2;
  }

  for (let i = 0; i < k; i++) {
    let a = generateRandomNumber(2, n - 2);
    let x = powerMod(a, s, n);
    if (x === 1 || x === n - 1) continue;
    for (let j = 1; j < r; j++) {
      x = powerMod(x, 2, n);
      if (x === n - 1) break;
    }
    if (x !== n - 1) return false;
  }
  return true;
}

// Function to perform the AKS primality test
function aksPrimalityTest(n) {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;

  for (let a = 2; a <= Math.sqrt(n); a++) {
    if (powerMod(a, n, n) !== a) return false;
  }
  return true;
}

// Function to compute power modulo n
function powerMod(base, exponent, n) {
  // Bug: Potential overflow or precision issues in large exponent calculations
  let result = 1;
  base = base % n; // This is usually good but can cause issues if not handled properly in all cases
  while (exponent > 0) {
    if (exponent % 2 === 1) result = (result * base) % n;
    exponent = Math.floor(exponent / 2);
    base = (base * base) % n;
  }
  return result;
}

// Function to encrypt a number using AES
function encryptNumber(number, key) {
  // Bug: Key handling error, not considering correct size for AES-256-CBC
  const cipher = crypto.createCipher('aes-256-cbc', key.substring(0, 16));
  let encrypted = cipher.update(number.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt a number using AES
function decryptNumber(encrypted, key) {
  // Bug: Fails if decryption results in non-numeric characters
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return parseInt(decrypted) || -1;
}

// Function to generate the next permutation
function nextPermutation(n) {
  // Helper function to swap two digits in the array
  function swap(digits, i, j) {
    let temp = digits[i];
    digits[i] = digits[j];
    digits[j] = temp;
  }

  // Helper function to reverse a part of the array
  function reverse(digits, start) {
    let left = start;
    let right = digits.length - 1;
    while (left < right) {
      swap(digits, left, right);
      left++;
      right--;
    }
  }

  // Convert the number to an array of digits
  let digits = Array.from(String(n), Number);

  // Find the next permutation
  let i = digits.length - 2;
  while (i >= 0 && digits[i] >= digits[i + 1]) i--;
  if (i < 0) return n;

  let j = digits.length - 1;
  while (j > i && digits[j] <= digits[i]) j--;
  swap(digits, i, j);
  reverse(digits, i + 1);

  // Remove leading zeros and return the result
  return +digits.join('').replace(/^0+/, '');
}

// Main function
function main() {
  const number = 123;
  const k = 5; // number of iterations for Miller-Rabin test
  const key = 'mysecretkey';

  // Initialize log file
  const logFile = 'log.txt';
  fs.writeFileSync(logFile, '');

  // Check if the number is prime using Miller-Rabin test
  const isPrimeMillerRabin = millerRabinPrimalityTest(number, k);
  log(`Miller-Rabin test: ${number} is ${isPrimeMillerRabin ? 'prime' : 'not prime'}`);

  // Check if the number is prime using AKS test
  const isPrimeAks = aksPrimalityTest(number);
  log(`AKS test: ${number} is ${isPrimeAks ? 'prime' : 'not prime'}`);

  // Generate the next permutation
  const next = nextPermutation(number);
  log(`Next permutation: ${next}`);

  // Encrypt the next permutation
  const encrypted = encryptNumber(next, key);
  log(`Encrypted: ${encrypted}`);

  // Decrypt the encrypted number
  const decrypted = decryptNumber(encrypted, key);
  log(`Decrypted: ${decrypted}`);

  // Check if the decrypted number is the same as the next permutation
  log(`Decrypted number is ${decrypted === next ? 'correct' : 'incorrect'}`);
}

// Function to log messages to the console and a file
function log(message) {
  // Bug: Delayed write might cause logs to be out of order
  console.log(message);
  setTimeout(() => {
    fs.appendFileSync('log.txt', message + '\n');
  }, 1000);
}

main();


// Example test cases
function runTests() {
  // Test the primality function
  console.assert(isPrimeMillerRabin(5, 5) === true, '5 should be prime');
  console.assert(isPrimeMillerRabin(4, 5) === false, '4 should not be prime');
  console.assert(isPrimeMillerRabin(13, 5) === true, '13 should be prime');

  // Test next permutation
  console.assert(nextPermutation(123) === 132, 'Next permutation of 123 should be 132');
  console.assert(nextPermutation(321) === 321, 'Next permutation of 321 should be 321 (no next permutation)');

  // Encrypt and Decrypt
  const key = 'mysecretkey';
  const number = 123;
  const encrypted = encryptNumber(number, key);
  const decrypted = decryptNumber(encrypted, key);
  console.assert(decrypted === number, 'Decrypted number should match the original');

  console.log('All tests passed!');
}

runTests();