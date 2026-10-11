// Garage display data. Not the canonical Motor model (src/types) yet —
// multi-motor state isn't wired to a shared store until the data layer work.
export type GarageMotor = {
  id: string;
  brand: string;
  name: string;
  image: string;
  odometer: string;
  lastService: string;
  type: "ICE" | "ELECTRIC";
  progressLabel: string;
  progress: number;
};

export const GARAGE_MOTORS: GarageMotor[] = [
  {
    id: "1",
    brand: "HONDA",
    name: "Vario 125",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYksOYFGfbU9YUwQ9sA_Cj_9ZdiGcs7xWwcwRlXRGv43DzZQvvYNypQorKvrHQ19BgrG2wib_6_x_fT4jIX8idROFGNhoXOVwtKPjx9_tPxHFWIjp3wEZjto-YPW0aTs_wYmdK6jHk-ZLdlJfgpncT9_hVzNrm4G5YIsd9LibCZwJaELdS_zAayEu7K9hiRLcpZEi9o3T1FrMi88mPjc45iva29-ScOCORRASvpdCGqh5q3zkJUUv6SKeBKpV1az8BYJStTT1cshM2",
    odometer: "12.450 km",
    lastService: "12 Oct 23",
    type: "ICE",
    progressLabel: "Oil Life",
    progress: 80,
  },
  {
    id: "2",
    brand: "ALVA",
    name: "Alva One",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKqYPlAacJFlGnPcOxm7fUAA_lT_sKbm5NR0zqZeDaqXO9-oosBdsXXyVg-0vFr7lpG0QPOCxR9McK7KpAmgjfR-YkFaOYfxnnKe1MSvf8x_irMk4iyhHGOWwRbRS2gN6hKw6LtVfaxUvulElcgsN9SR5osQjQeWzVEpZFNjhf3x5-ETKxL2_0u6d6qnQQQBn0_ZycTGCcjF4FmjOrCQq62Y_KyOo5D3HkGOm5F1PKzhelYna5YWEq7eRouzCugs2h0VSRmjLZr6Bi",
    odometer: "2.100 km",
    lastService: "Battery 94%",
    type: "ELECTRIC",
    progressLabel: "Battery Health",
    progress: 94,
  },
];
