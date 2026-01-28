#!/usr/bin/env node

/**
 * Test script for local content provider
 * This verifies that the local content provider correctly loads and filters data
 */

const path = require("path");
const { createLocalContentClient } = require("./lib/localContentProvider.js");

console.log("🧪 Testing Local Content Provider...\n");

async function testLocalContentProvider() {
  let passed = 0;
  let failed = 0;

  // Create a client instance
  const client = createLocalContentClient();

  // Test 1: Select all courses
  console.log("Test 1: Select all courses");
  const { data: allCourses, error: error1 } = await client.from("courses").select("*");
  if (allCourses && allCourses.length > 0 && !error1) {
    console.log(`✓ Passed: Found ${allCourses.length} courses`);
    passed++;
  } else {
    console.log("✗ Failed: Could not retrieve courses");
    failed++;
  }

  // Test 2: Filter courses by subdomain
  console.log("\nTest 2: Filter courses by subdomain");
  const { data: jeeoCourses, error: error2 } = await client
    .from("courses")
    .select("*")
    .eq("subdomain", "learn-jee");
  if (jeeoCourses && !error2) {
    console.log(`✓ Passed: Found ${jeeoCourses.length} JEE courses`);
    passed++;
  } else {
    console.log("✗ Failed: Could not filter courses by subdomain");
    failed++;
  }

  // Test 3: Order courses by title
  console.log("\nTest 3: Order courses");
  const { data: orderedCourses, error: error3 } = await client
    .from("courses")
    .select("*")
    .order("title", { ascending: true });
  if (orderedCourses && !error3) {
    console.log(
      `✓ Passed: Ordered ${orderedCourses.length} courses (first: "${orderedCourses[0]?.title}")`
    );
    passed++;
  } else {
    console.log("✗ Failed: Could not order courses");
    failed++;
  }

  // Test 4: Limit results
  console.log("\nTest 4: Limit results");
  const { data: limitedCourses, error: error4 } = await client
    .from("courses")
    .select("*")
    .limit(2);
  if (limitedCourses && limitedCourses.length === 2 && !error4) {
    console.log(`✓ Passed: Limited to ${limitedCourses.length} courses`);
    passed++;
  } else {
    console.log("✗ Failed: Could not limit results");
    failed++;
  }

  // Test 5: Get single record
  console.log("\nTest 5: Get single record");
  const { data: singleCourse, error: error5 } = await client
    .from("courses")
    .select("*")
    .eq("id", "course-1")
    .single();
  if (singleCourse && singleCourse.id === "course-1" && !error5) {
    console.log(`✓ Passed: Retrieved single course "${singleCourse.title}"`);
    passed++;
  } else {
    console.log("✗ Failed: Could not retrieve single record");
    failed++;
  }

  // Test 6: Filter with multiple conditions
  console.log("\nTest 6: Filter with multiple conditions");
  const { data: freeCourses, error: error6 } = await client
    .from("courses")
    .select("*")
    .eq("is_free", true)
    .eq("status", "published");
  if (freeCourses !== null && !error6) {
    console.log(`✓ Passed: Found ${freeCourses.length} free published courses`);
    passed++;
  } else {
    console.log("✗ Failed: Could not filter with multiple conditions");
    failed++;
  }

  // Test 7: Test insert (should mock)
  console.log("\nTest 7: Test insert (mocked)");
  const { data: insertResult, error: error7 } = await client
    .from("courses")
    .insert([{ title: "Test Course", slug: "test-course" }]);
  if (insertResult && !error7) {
    console.log("✓ Passed: Insert operation mocked successfully");
    passed++;
  } else {
    console.log("✗ Failed: Insert operation did not work");
    failed++;
  }

  // Test 8: Test update (should mock)
  console.log("\nTest 8: Test update (mocked)");
  const { data: updateResult, error: error8 } = await client
    .from("courses")
    .update({ title: "Updated Course" })
    .eq("id", "course-1");
  if (updateResult && !error8) {
    console.log("✓ Passed: Update operation mocked successfully");
    passed++;
  } else {
    console.log("✗ Failed: Update operation did not work");
    failed++;
  }

  // Test 9: Test delete (should mock)
  console.log("\nTest 9: Test delete (mocked)");
  const { error: error9 } = await client.from("courses").delete().eq("id", "course-1");
  if (!error9) {
    console.log("✓ Passed: Delete operation mocked successfully");
    passed++;
  } else {
    console.log("✗ Failed: Delete operation did not work");
    failed++;
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`Test Summary: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(50));

  if (failed > 0) {
    process.exit(1);
  }
}

testLocalContentProvider().catch((error) => {
  console.error("Test failed with error:", error);
  process.exit(1);
});
