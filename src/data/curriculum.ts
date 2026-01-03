export interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  completed: boolean;
  hasVideo: boolean;
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface DifficultyLevel {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Domain {
  id: string;
  name: string;
  shortName: string;
  difficulties: DifficultyLevel[];
}

// Helper to create questions from an array of titles
const createQuestions = (titles: string[], baseId: string): Question[] =>
  titles.map((title, index) => ({
    id: `${baseId}-${index + 1}`,
    title,
    difficulty: "Easy" as const,
    time: "10 min",
    completed: false,
    hasVideo: true,
  }));

export const curriculumData: Domain[] = [
  {
    id: "maths",
    name: "Mathematics",
    shortName: "Maths",
    difficulties: [
      {
        id: "beginner",
        name: "Beginner",
        topics: [
          {
            id: "number-system",
            name: "Number System",
            questions: createQuestions([
              "Find the smallest 3-digit number divisible by 9",
              "Write the place value of 7 in 47,582",
              "Find the sum of first 10 natural numbers",
            ], "maths-beg-ns"),
          },
          {
            id: "lcm-hcf",
            name: "LCM & HCF",
            questions: createQuestions([
              "Find the HCF of 12 and 18",
              "Find the LCM of 6 and 15",
              "Find the LCM and HCF of 24 and 36",
            ], "maths-beg-lh"),
          },
          {
            id: "fractions-decimals",
            name: "Fractions & Decimals",
            questions: createQuestions([
              "Convert 3/4 into decimal",
              "Add 2/5 + 3/10",
              "Subtract 1.25 from 4.5",
            ], "maths-beg-fd"),
          },
          {
            id: "percentages",
            name: "Percentages",
            questions: createQuestions([
              "Find 20% of 150",
              "A price of ₹500 is reduced by 10%. Find the new price",
              "A number is increased by 25% to become 250. Find the original number",
            ], "maths-beg-pct"),
          },
          {
            id: "ratio-proportion",
            name: "Ratio & Proportion",
            questions: createQuestions([
              "Simplify the ratio 18 : 24",
              "Divide ₹600 in the ratio 2 : 3",
              "If 5 books cost ₹150, find the cost of 8 books",
            ], "maths-beg-rp"),
          },
          {
            id: "averages",
            name: "Averages",
            questions: createQuestions([
              "Find the average of 5, 10, and 15",
              "The average of 4 numbers is 20. Find their sum",
              "The average age of 6 students is 18. A new student joins; the average becomes 19. Find the new student's age",
            ], "maths-beg-avg"),
          },
          {
            id: "simple-compound-interest",
            name: "Simple & Compound Interest",
            questions: createQuestions([
              "Find the simple interest on ₹1000 at 10% per year for 2 years",
              "Find the amount after 1 year on ₹2000 at 5% simple interest",
              "Find the compound interest on ₹1000 at 10% for 2 years",
            ], "maths-beg-sci"),
          },
          {
            id: "linear-equations",
            name: "Linear Equations (One Variable)",
            questions: createQuestions([
              "Solve: x + 7 = 15",
              "Solve: 2x = 18",
              "Solve: 3x − 5 = 16",
            ], "maths-beg-le"),
          },
          {
            id: "basic-geometry",
            name: "Basic Geometry (Lines & Angles)",
            questions: createQuestions([
              "Find the complement of 35°",
              "Find the supplementary angle of 110°",
              "If two angles are vertically opposite and one angle is 50°, find the other",
            ], "maths-beg-geo"),
          },
          {
            id: "triangles",
            name: "Triangles",
            questions: createQuestions([
              "Find the third angle of a triangle if two angles are 40° and 70°",
              "State the sum of interior angles of a triangle",
              "Can a triangle have angles 90°, 45°, and 45°? Explain",
            ], "maths-beg-tri"),
          },
          {
            id: "data-handling",
            name: "Data Handling",
            questions: createQuestions([
              "Find the mean of 2, 4, 6, 8",
              "Find the median of 3, 7, 9, 11, 13",
              "Find the mode of: 1, 2, 2, 3, 4",
            ], "maths-beg-dh"),
          },
          {
            id: "profit-loss",
            name: "Profit & Loss",
            questions: createQuestions([
              "A shopkeeper buys an item for ₹200 and sells it for ₹250. Find the profit",
              "Find the loss if a product is bought for ₹500 and sold for ₹450",
              "Find the profit percentage if CP = ₹400 and SP = ₹500",
            ], "maths-beg-pl"),
          },
          {
            id: "time-work",
            name: "Time & Work",
            questions: createQuestions([
              "A can do a work in 10 days. How much work does he do in 1 day?",
              "A work is completed in 5 days. What part of work is done in 1 day?",
              "If A can complete a work in 8 days, how long will he take to complete half the work?",
            ], "maths-beg-tw"),
          },
          {
            id: "time-distance",
            name: "Time & Distance",
            questions: createQuestions([
              "Find the speed of a vehicle that travels 60 km in 2 hours",
              "Find the distance covered at a speed of 40 km/h in 3 hours",
              "Find the time taken to cover 120 km at 60 km/h",
            ], "maths-beg-td"),
          },
          {
            id: "mensuration-2d",
            name: "Mensuration (2D Basics)",
            questions: createQuestions([
              "Find the perimeter of a square of side 5 cm",
              "Find the area of a rectangle of length 8 cm and breadth 6 cm",
              "Find the area of a triangle with base 10 cm and height 5 cm",
            ], "maths-beg-m2d"),
          },
          {
            id: "basic-algebra",
            name: "Basic Algebra",
            questions: createQuestions([
              "Simplify: 3x + 5x",
              "Find the value of x if x = 4 in the expression 2x + 3",
              "Simplify: (x + 3) − (2x − 1)",
            ], "maths-beg-alg"),
          },
          {
            id: "squares-cubes",
            name: "Squares & Cubes",
            questions: createQuestions([
              "Find the square of 12",
              "Find the cube of 5",
              "Find the square root of 144",
            ], "maths-beg-sc"),
          },
          {
            id: "simplification",
            name: "Simplification",
            questions: createQuestions([
              "Simplify: 10 + 5 × 2",
              "Simplify: (12 ÷ 3) + 4",
              "Simplify: 20 − {5 + (3 × 2)}",
            ], "maths-beg-sim"),
          },
          {
            id: "basic-probability",
            name: "Basic Probability",
            questions: createQuestions([
              "What is the probability of getting a head when tossing a coin?",
              "What is the probability of getting an even number on a dice?",
              "How many total outcomes are possible when a dice is thrown?",
            ], "maths-beg-prob"),
          },
          {
            id: "logical-basics",
            name: "Logical Basics (Math Reasoning)",
            questions: createQuestions([
              "Find the next number: 2, 4, 6, __",
              "Find the missing number: 5, 10, 15, __",
              "Which number is odd: 12, 18, 21, 24?",
            ], "maths-beg-log"),
          },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        topics: [
          {
            id: "quadratic-equations",
            name: "Quadratic Equations",
            questions: createQuestions([
              "Solve: x² − 5x + 6 = 0",
              "Solve: x² + 7x + 10 = 0",
              "Find the roots of x² − 9 = 0",
            ], "maths-int-qe"),
          },
          {
            id: "inequalities",
            name: "Inequalities",
            questions: createQuestions([
              "Solve: x + 3 < 10",
              "Solve: 2x − 5 ≥ 9",
              "Solve: −3x ≤ 12",
            ], "maths-int-ineq"),
          },
          {
            id: "arithmetic-progression",
            name: "Arithmetic Progression (AP)",
            questions: createQuestions([
              "Find the 10th term of AP: 2, 5, 8, …",
              "Find the common difference of 7, 14, 21",
              "Find the next term of AP: 4, 9, 14, __",
            ], "maths-int-ap"),
          },
          {
            id: "coordinate-geometry",
            name: "Coordinate Geometry (2D)",
            questions: createQuestions([
              "Find the distance between (0,0) and (3,4)",
              "Find the midpoint of (2,4) and (6,8)",
              "Find the coordinates of origin",
            ], "maths-int-cg"),
          },
          {
            id: "trigonometry-basics",
            name: "Trigonometry (Basics)",
            questions: createQuestions([
              "Find sin 30°",
              "Find cos 60°",
              "Find tan 45°",
            ], "maths-int-trig"),
          },
          {
            id: "permutations-combinations",
            name: "Permutations & Combinations",
            questions: createQuestions([
              "Find the number of ways to arrange 3 objects",
              "Find 5P2",
              "Find 6C2",
            ], "maths-int-pc"),
          },
          {
            id: "probability-basic",
            name: "Probability (Basic)",
            questions: createQuestions([
              "Find probability of getting 6 on a dice",
              "Find probability of getting red ball from 3 red, 2 blue",
              "Find probability of getting tail when tossing a coin",
            ], "maths-int-prob"),
          },
          {
            id: "mensuration-3d",
            name: "Mensuration (3D)",
            questions: createQuestions([
              "Find volume of cube of side 4 cm",
              "Find curved surface area of cylinder (r=7, h=10)",
              "Find volume of sphere of radius 7 cm",
            ], "maths-int-m3d"),
          },
          {
            id: "functions-graphs",
            name: "Functions & Graphs",
            questions: createQuestions([
              "Find value of f(x)=2x+3 when x=2",
              "Is f(x)=x² an even function?",
              "Find f(−1) for f(x)=x²+1",
            ], "maths-int-fg"),
          },
          {
            id: "set-theory",
            name: "Set Theory",
            questions: createQuestions([
              "Write elements of set of even numbers less than 10",
              "Find A ∪ B if A={1,2}, B={2,3}",
              "Find A ∩ B if A={1,3,5}, B={3,5,7}",
            ], "maths-int-set"),
          },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        topics: [
          {
            id: "limits",
            name: "Limits",
            questions: createQuestions([
              "Find lim x→0 (x+2)",
              "Find lim x→2 (x² − 4)/(x − 2)",
              "Find lim x→∞ 1/x",
            ], "maths-adv-lim"),
          },
          {
            id: "differentiation",
            name: "Differentiation",
            questions: createQuestions([
              "Find derivative of x²",
              "Find derivative of 5x",
              "Find derivative of sin x",
            ], "maths-adv-diff"),
          },
          {
            id: "integration",
            name: "Integration",
            questions: createQuestions([
              "∫ x dx",
              "∫ 5 dx",
              "∫ x² dx",
            ], "maths-adv-int"),
          },
          {
            id: "matrices",
            name: "Matrices",
            questions: createQuestions([
              "Find order of a 2×3 matrix",
              "Add matrices [[1,2],[3,4]] and [[2,3],[4,5]]",
              "Find transpose of a 2×2 matrix",
            ], "maths-adv-mat"),
          },
          {
            id: "determinants",
            name: "Determinants",
            questions: createQuestions([
              "Find determinant of [[1,2],[3,4]]",
              "Find determinant of identity matrix",
              "Check if determinant of [[2,4],[1,2]] is zero",
            ], "maths-adv-det"),
          },
          {
            id: "vector-algebra",
            name: "Vector Algebra",
            questions: createQuestions([
              "Find magnitude of vector i + j",
              "Find i · j",
              "Find angle between parallel vectors",
            ], "maths-adv-vec"),
          },
          {
            id: "complex-numbers",
            name: "Complex Numbers",
            questions: createQuestions([
              "Find i²",
              "Simplify (2 + 3i) + (1 − i)",
              "Find conjugate of 4 + 5i",
            ], "maths-adv-cn"),
          },
          {
            id: "advanced-probability",
            name: "Advanced Probability",
            questions: createQuestions([
              "Probability of drawing ace from deck",
              "Probability of getting at least one head in two tosses",
              "Probability of getting sum 7 on two dice",
            ], "maths-adv-prob"),
          },
          {
            id: "statistics",
            name: "Statistics",
            questions: createQuestions([
              "Find mean of 5,10,15",
              "Find variance of 2,2,2",
              "Find standard deviation of equal numbers",
            ], "maths-adv-stat"),
          },
          {
            id: "differential-equations",
            name: "Differential Equations",
            questions: createQuestions([
              "Solve dy/dx = 0",
              "Solve dy/dx = x",
              "Find order of d²y/dx² = x",
            ], "maths-adv-de"),
          },
        ],
      },
    ],
  },
  {
    id: "aptitude",
    name: "Aptitude",
    shortName: "Aptitude",
    difficulties: [
      {
        id: "beginner",
        name: "Beginner",
        topics: [
          {
            id: "percentages",
            name: "Percentages",
            questions: createQuestions([
              "Find 10% of 200",
              "Increase 300 by 20%",
              "Decrease 500 by 10%",
            ], "apt-beg-pct"),
          },
          {
            id: "ratio-proportion",
            name: "Ratio & Proportion",
            questions: createQuestions([
              "Simplify 12:18",
              "Divide 100 in ratio 2:3",
              "If 3 pens cost ₹30, find cost of 5 pens",
            ], "apt-beg-rp"),
          },
          {
            id: "profit-loss",
            name: "Profit & Loss",
            questions: createQuestions([
              "CP=200, SP=250 find profit",
              "CP=500, SP=450 find loss",
              "Find profit % if CP=400, SP=500",
            ], "apt-beg-pl"),
          },
          {
            id: "simple-interest",
            name: "Simple Interest",
            questions: createQuestions([
              "Find SI on ₹1000 at 10% for 1 year",
              "Find SI on ₹500 at 5% for 2 years",
              "Find total amount if SI=₹200 on ₹1000",
            ], "apt-beg-si"),
          },
          {
            id: "time-work",
            name: "Time & Work",
            questions: createQuestions([
              "A does work in 10 days; find 1 day work",
              "Work completed in 5 days; find per day work",
              "A completes work in 8 days; how much in 1 day?",
            ], "apt-beg-tw"),
          },
          {
            id: "time-distance",
            name: "Time & Distance",
            questions: createQuestions([
              "Speed = distance/time, find speed",
              "Find distance if speed 60 km/h, time 2 h",
              "Find time if distance 120 km, speed 40 km/h",
            ], "apt-beg-td"),
          },
          {
            id: "averages",
            name: "Averages",
            questions: createQuestions([
              "Average of 2,4,6",
              "Average of first 10 natural numbers",
              "Average age of 3 people is 20; find sum",
            ], "apt-beg-avg"),
          },
          {
            id: "number-series",
            name: "Number Series",
            questions: createQuestions([
              "Find next: 2,4,6,__",
              "Find next: 5,10,15,__",
              "Find next: 1,4,9,__",
            ], "apt-beg-ns"),
          },
          {
            id: "simplification",
            name: "Simplification",
            questions: createQuestions([
              "10 + 5 × 2",
              "(12 ÷ 3) + 4",
              "20 − (5 + 3)",
            ], "apt-beg-sim"),
          },
          {
            id: "logical-basics",
            name: "Logical Basics",
            questions: createQuestions([
              "Find odd one: 2,4,6,9",
              "Find missing number: 1,3,5,__",
              "True or False: All squares are rectangles",
            ], "apt-beg-log"),
          },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        topics: [
          {
            id: "compound-interest",
            name: "Compound Interest",
            questions: createQuestions([
              "Find CI on ₹1000 at 10% for 2 years",
              "Find amount after 1 year at 5% CI",
              "Difference between CI and SI for 2 years",
            ], "apt-int-ci"),
          },
          {
            id: "pipes-cisterns",
            name: "Pipes & Cisterns",
            questions: createQuestions([
              "Pipe fills tank in 10 hrs; find 1 hr work",
              "Pipe empties tank in 15 hrs; find 1 hr work",
              "One pipe fills, one empties; find net work",
            ], "apt-int-pc"),
          },
          {
            id: "boats-streams",
            name: "Boats & Streams",
            questions: createQuestions([
              "Find speed upstream",
              "Find speed downstream",
              "Find speed of boat in still water",
            ], "apt-int-bs"),
          },
          {
            id: "clocks",
            name: "Clocks",
            questions: createQuestions([
              "Angle at 3:00",
              "Angle at 6:00",
              "How many times hands coincide in 24 hrs?",
            ], "apt-int-clk"),
          },
          {
            id: "calendars",
            name: "Calendars",
            questions: createQuestions([
              "Find day on 15 Aug 1947",
              "How many odd days in a leap year?",
              "How many days in 3 non-leap years?",
            ], "apt-int-cal"),
          },
          {
            id: "permutation-combination",
            name: "Permutation & Combination",
            questions: createQuestions([
              "Number of ways to arrange 4 people",
              "Find 7C2",
              "Find 5P3",
            ], "apt-int-pnc"),
          },
          {
            id: "probability",
            name: "Probability",
            questions: createQuestions([
              "Probability of red ball from bag",
              "Probability of even number on dice",
              "Probability of tail in coin toss",
            ], "apt-int-prob"),
          },
          {
            id: "data-interpretation",
            name: "Data Interpretation",
            questions: createQuestions([
              "Find average from given table",
              "Find highest value in bar graph",
              "Find percentage increase from chart",
            ], "apt-int-di"),
          },
          {
            id: "blood-relations",
            name: "Blood Relations",
            questions: createQuestions([
              "Father's son's sister relation?",
              "Mother's brother is called?",
              "Son of my uncle is my ___",
            ], "apt-int-br"),
          },
          {
            id: "coding-decoding",
            name: "Coding-Decoding",
            questions: createQuestions([
              "If CAT → DBU, code DOG",
              "If A=1, Z=?",
              "If 5 → E, 10 → ?",
            ], "apt-int-cd"),
          },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        topics: [
          {
            id: "advanced-di",
            name: "Advanced DI (Caselets)",
            questions: createQuestions([
              "Find profit % from given table",
              "Find highest growth year",
              "Find average sales",
            ], "apt-adv-di"),
          },
          {
            id: "logical-puzzles",
            name: "Logical Puzzles",
            questions: createQuestions([
              "Seating arrangement with 5 people",
              "Direction-based puzzle",
              "Floor-based puzzle",
            ], "apt-adv-lp"),
          },
          {
            id: "seating-arrangement",
            name: "Seating Arrangement (Complex)",
            questions: createQuestions([
              "Circular seating facing center",
              "Linear seating with conditions",
              "Mixed direction seating",
            ], "apt-adv-sa"),
          },
          {
            id: "input-output",
            name: "Input–Output",
            questions: createQuestions([
              "Step-based number rearrangement",
              "Word-number transformation",
              "Alphabet shifting logic",
            ], "apt-adv-io"),
          },
          {
            id: "advanced-probability",
            name: "Advanced Probability",
            questions: createQuestions([
              "Probability of at least one head",
              "Probability of card not being face card",
              "Probability of sum greater than 8 on dice",
            ], "apt-adv-prob"),
          },
          {
            id: "venn-diagrams",
            name: "Venn Diagrams",
            questions: createQuestions([
              "Find common students in 2 sets",
              "Find only A students",
              "Find neither A nor B students",
            ], "apt-adv-vd"),
          },
          {
            id: "decision-making",
            name: "Decision Making",
            questions: createQuestions([
              "Choose best option from data",
              "Ethical dilemma-based decision",
              "Business scenario decision",
            ], "apt-adv-dm"),
          },
          {
            id: "critical-reasoning",
            name: "Critical Reasoning",
            questions: createQuestions([
              "Identify assumption",
              "Identify conclusion",
              "Strengthen the argument",
            ], "apt-adv-cr"),
          },
          {
            id: "quantitative-comparison",
            name: "Quantitative Comparison",
            questions: createQuestions([
              "Compare two algebraic values",
              "Compare two fractions",
              "Compare two percentages",
            ], "apt-adv-qc"),
          },
          {
            id: "mixed-model",
            name: "Mixed Model Questions",
            questions: createQuestions([
              "Combination of time, work, and ratio",
              "Probability + permutation question",
              "DI + percentage mix",
            ], "apt-adv-mm"),
          },
        ],
      },
    ],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    difficulties: [
      {
        id: "beginner",
        name: "Beginner",
        topics: [
          {
            id: "time-space-complexity",
            name: "Time & Space Complexity",
            questions: createQuestions([
              "Find time complexity of a loop running from 1 to n",
              "Find time complexity of two nested loops",
              "What is the space complexity of storing an array of size n?",
            ], "dsa-beg-tsc"),
          },
          {
            id: "arrays",
            name: "Arrays",
            questions: createQuestions([
              "Find the maximum element in an array",
              "Reverse an array",
              "Find the sum of all elements in an array",
            ], "dsa-beg-arr"),
          },
          {
            id: "strings",
            name: "Strings",
            questions: createQuestions([
              "Reverse a string",
              "Check if a string is palindrome",
              "Count vowels in a string",
            ], "dsa-beg-str"),
          },
          {
            id: "recursion-basics",
            name: "Recursion (Basics)",
            questions: createQuestions([
              "Print numbers from 1 to n using recursion",
              "Find factorial of n using recursion",
              "Find sum of first n numbers using recursion",
            ], "dsa-beg-rec"),
          },
          {
            id: "searching",
            name: "Searching",
            questions: createQuestions([
              "Perform linear search on an array",
              "Perform binary search on a sorted array",
              "Find the position of an element in an array",
            ], "dsa-beg-src"),
          },
          {
            id: "sorting-basic",
            name: "Sorting (Basic)",
            questions: createQuestions([
              "Sort an array using bubble sort",
              "Sort an array using selection sort",
              "Sort an array using insertion sort",
            ], "dsa-beg-srt"),
          },
          {
            id: "stack-introduction",
            name: "Stack (Introduction)",
            questions: createQuestions([
              "Push an element into stack",
              "Pop an element from stack",
              "Display stack elements",
            ], "dsa-beg-stk"),
          },
          {
            id: "queue-introduction",
            name: "Queue (Introduction)",
            questions: createQuestions([
              "Enqueue an element into queue",
              "Dequeue an element from queue",
              "Check if queue is empty",
            ], "dsa-beg-que"),
          },
          {
            id: "basic-math-algorithms",
            name: "Basic Math Algorithms",
            questions: createQuestions([
              "Check if a number is prime",
              "Find GCD of two numbers",
              "Find LCM of two numbers",
            ], "dsa-beg-math"),
          },
          {
            id: "two-pointer-technique",
            name: "Two Pointer Technique",
            questions: createQuestions([
              "Find pair with given sum in sorted array",
              "Remove duplicates from sorted array",
              "Reverse array using two pointers",
            ], "dsa-beg-tp"),
          },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        topics: [
          {
            id: "linked-list",
            name: "Linked List",
            questions: createQuestions([
              "Insert a node at beginning",
              "Delete a node from linked list",
              "Traverse a linked list",
            ], "dsa-int-ll"),
          },
          {
            id: "stack-applications",
            name: "Stack (Applications)",
            questions: createQuestions([
              "Reverse string using stack",
              "Check balanced parentheses",
              "Convert infix to postfix",
            ], "dsa-int-stk"),
          },
          {
            id: "queue-applications",
            name: "Queue (Applications)",
            questions: createQuestions([
              "Implement queue using array",
              "Implement circular queue",
              "Implement queue using stack",
            ], "dsa-int-que"),
          },
          {
            id: "hashing",
            name: "Hashing",
            questions: createQuestions([
              "Count frequency of elements in array",
              "Find first non-repeating element",
              "Check if two arrays are equal",
            ], "dsa-int-hash"),
          },
          {
            id: "binary-tree",
            name: "Trees (Binary Tree)",
            questions: createQuestions([
              "Perform inorder traversal",
              "Perform preorder traversal",
              "Perform postorder traversal",
            ], "dsa-int-bt"),
          },
          {
            id: "binary-search-tree",
            name: "Binary Search Tree",
            questions: createQuestions([
              "Insert node in BST",
              "Search element in BST",
              "Find minimum element in BST",
            ], "dsa-int-bst"),
          },
          {
            id: "recursion-backtracking",
            name: "Recursion & Backtracking",
            questions: createQuestions([
              "Generate all subsets of a set",
              "Solve Tower of Hanoi",
              "Generate permutations of string",
            ], "dsa-int-rb"),
          },
          {
            id: "sorting-advanced",
            name: "Sorting (Advanced)",
            questions: createQuestions([
              "Sort array using merge sort",
              "Sort array using quick sort",
              "Compare merge sort and quick sort",
            ], "dsa-int-srt"),
          },
          {
            id: "sliding-window",
            name: "Sliding Window",
            questions: createQuestions([
              "Find maximum sum subarray of size k",
              "Find first negative number in every window",
              "Find longest substring with k distinct characters",
            ], "dsa-int-sw"),
          },
          {
            id: "bit-manipulation",
            name: "Bit Manipulation",
            questions: createQuestions([
              "Check if number is even or odd",
              "Find number of set bits",
              "Find the only non-repeating element",
            ], "dsa-int-bit"),
          },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        topics: [
          {
            id: "heap",
            name: "Heap",
            questions: createQuestions([
              "Implement min heap",
              "Find kth largest element",
              "Convert array into heap",
            ], "dsa-adv-heap"),
          },
          {
            id: "trie",
            name: "Trie",
            questions: createQuestions([
              "Insert word into trie",
              "Search word in trie",
              "Check prefix existence",
            ], "dsa-adv-trie"),
          },
          {
            id: "graph-basics",
            name: "Graph (Basics)",
            questions: createQuestions([
              "Represent graph using adjacency list",
              "Perform BFS traversal",
              "Perform DFS traversal",
            ], "dsa-adv-gb"),
          },
          {
            id: "graph-algorithms",
            name: "Graph Algorithms",
            questions: createQuestions([
              "Find shortest path using Dijkstra",
              "Detect cycle in graph",
              "Find minimum spanning tree",
            ], "dsa-adv-ga"),
          },
          {
            id: "dp-basics",
            name: "Dynamic Programming (Basics)",
            questions: createQuestions([
              "Find nth Fibonacci number",
              "Solve 0/1 knapsack problem",
              "Find longest common subsequence",
            ], "dsa-adv-dpb"),
          },
          {
            id: "advanced-dp",
            name: "Advanced DP",
            questions: createQuestions([
              "Find longest increasing subsequence",
              "Solve matrix chain multiplication",
              "Solve coin change problem",
            ], "dsa-adv-dpa"),
          },
          {
            id: "segment-tree",
            name: "Segment Tree",
            questions: createQuestions([
              "Build segment tree",
              "Range sum query",
              "Update element in segment tree",
            ], "dsa-adv-seg"),
          },
          {
            id: "disjoint-set",
            name: "Disjoint Set (Union–Find)",
            questions: createQuestions([
              "Implement union operation",
              "Implement find operation",
              "Detect cycle using DSU",
            ], "dsa-adv-dsu"),
          },
          {
            id: "string-algorithms",
            name: "String Algorithms",
            questions: createQuestions([
              "Implement KMP pattern matching",
              "Find longest prefix suffix array",
              "Implement Z-algorithm",
            ], "dsa-adv-sa"),
          },
          {
            id: "topological-sorting",
            name: "Topological Sorting",
            questions: createQuestions([
              "Perform topological sort using DFS",
              "Perform topological sort using BFS",
              "Check if graph has cycle using topo sort",
            ], "dsa-adv-ts"),
          },
        ],
      },
    ],
  },
];

// Helper functions to get data
export const getDomain = (domainId: string) =>
  curriculumData.find((d) => d.id === domainId);

export const getDifficulty = (domainId: string, difficultyId: string) =>
  getDomain(domainId)?.difficulties.find((d) => d.id === difficultyId);

export const getTopic = (domainId: string, difficultyId: string, topicId: string) =>
  getDifficulty(domainId, difficultyId)?.topics.find((t) => t.id === topicId);

export const getTopicsForDifficulty = (domainId: string, difficultyId: string) =>
  getDifficulty(domainId, difficultyId)?.topics || [];

export const getQuestionsForTopic = (domainId: string, difficultyId: string, topicId: string) =>
  getTopic(domainId, difficultyId, topicId)?.questions || [];
