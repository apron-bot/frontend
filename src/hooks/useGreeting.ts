import { useState, useEffect } from 'react';

interface Greeting {
  text: string;
  subtitle: string;
  nightText: string;
  nightSubtitle: string;
}

export function useGreeting(): Greeting {
  const [greeting, setGreeting] = useState<Greeting>(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}

function getGreeting(): Greeting {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return {
      text: 'Good morning! Breakfast ideas?',
      subtitle: "Let's start the day with something delicious",
      nightText: 'Too tired to cook?',
      nightSubtitle: "I'm scanning the best breakfast delivery deals for you.",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: 'Good afternoon! Planning dinner?',
      subtitle: "Tonight's recipe: Tortilla Española · 6 ingredients ready",
      nightText: 'Relax. Food is on its way.',
      nightSubtitle: "I'm scanning the best delivery deals for you.",
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      text: 'Good evening! Ready to cook?',
      subtitle: "Tonight's recipe: Tortilla Española · 6 ingredients ready",
      nightText: 'Relax. Food is on its way.',
      nightSubtitle: "I'm scanning the best delivery deals for you.",
    };
  } else {
    return {
      text: 'Midnight snack?',
      subtitle: 'Something light, maybe?',
      nightText: 'Late night cravings?',
      nightSubtitle: "I'm finding what's still delivering near you.",
    };
  }
}
