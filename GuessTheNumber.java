import java.util.Random;
import java.util.Scanner;

public class GuessTheNumber {
    public static void main(String[] args) {
        // Create a Random object to generate random numbers
        Random rand = new Random();
        // Generate a random number between 1 and 100
        int numberToGuess = rand.nextInt(100) + 1;
        int numberOfTries = 0;
        Scanner input = new Scanner(System.in);
        int guess;
        boolean win = false;

        System.out.println("Welcome to Guess the Number!");
        System.out.println("I have selected a number between 1 and 100.");
        System.out.println("Try to guess it!");

        while (!win) {
            System.out.print("Enter your guess: ");
            guess = input.nextInt();
            numberOfTries++;

            if (guess < 1 || guess > 100) {
                System.out.println("Please enter a number between 1 and 100.");
            } else if (guess < numberToGuess) {
                System.out.println("Your guess is too low.");
            } else if (guess > numberToGuess) {
                System.out.println("Your guess is too high.");
            } else {
                win = true;
                System.out.println("Congratulations! You guessed the number in " + numberOfTries + " tries.");
            }
        }

        input.close();
    }
}
