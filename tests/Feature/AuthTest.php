<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_login_and_register_pages(): void
    {
        $this->get('/login')->assertStatus(200);
        $this->get('/register')->assertStatus(200);
    }

    public function test_renter_registration_successful(): void
    {
        $response = $this->post('/register', [
            'name' => 'Maria Renter',
            'email' => 'maria.renter@example.com',
            'phone' => '09170001122',
            'role' => 'renter',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertRedirect(route('renter.bookings'));
        $this->assertAuthenticated();

        $user = User::where('email', 'maria.renter@example.com')->firstOrFail();
        $this->assertEquals('renter', $user->role);
        $this->assertTrue($user->isRenter());
    }

    public function test_owner_registration_successful(): void
    {
        $response = $this->post('/register', [
            'name' => 'Bohol Host Pedro',
            'email' => 'pedro.host@example.com',
            'phone' => '09181112233',
            'role' => 'owner',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertRedirect(route('owner.dashboard'));
        $this->assertAuthenticated();

        $user = User::where('email', 'pedro.host@example.com')->firstOrFail();
        $this->assertEquals('owner', $user->role);
        $this->assertTrue($user->isOwner());
    }

    public function test_registration_validation_enforced(): void
    {
        $response = $this->post('/register', [
            'name' => '',
            'email' => 'invalid-email',
            'phone' => '',
            'role' => 'invalid_role',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'phone', 'role', 'password']);
    }

    public function test_user_login_redirections_by_role(): void
    {
        // 1. Renter login
        $renter = User::factory()->create([
            'email' => 'renter.login@example.com',
            'password' => bcrypt('Password123!'),
            'role' => 'renter',
        ]);

        $renterLogin = $this->post('/login', [
            'email' => 'renter.login@example.com',
            'password' => 'Password123!',
        ]);
        $renterLogin->assertRedirect(route('renter.bookings'));
        $this->assertAuthenticatedAs($renter);
        auth()->logout();

        // 2. Owner login
        $owner = User::factory()->create([
            'email' => 'owner.login@example.com',
            'password' => bcrypt('Password123!'),
            'role' => 'owner',
        ]);

        $ownerLogin = $this->post('/login', [
            'email' => 'owner.login@example.com',
            'password' => 'Password123!',
        ]);
        $ownerLogin->assertRedirect(route('owner.dashboard'));
        $this->assertAuthenticatedAs($owner);
        auth()->logout();

        // 3. Admin login
        $admin = User::factory()->create([
            'email' => 'admin.login@example.com',
            'password' => bcrypt('Password123!'),
            'role' => 'admin',
        ]);

        $adminLogin = $this->post('/login', [
            'email' => 'admin.login@example.com',
            'password' => 'Password123!',
        ]);
        $adminLogin->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($admin);
    }

    public function test_login_with_invalid_credentials_fails(): void
    {
        $user = User::factory()->create([
            'email' => 'real.user@example.com',
            'password' => bcrypt('CorrectPassword123!'),
        ]);

        $response = $this->post('/login', [
            'email' => 'real.user@example.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_authenticated_user_can_switch_roles_between_renter_and_owner(): void
    {
        $user = User::factory()->create(['role' => 'renter']);

        // Switch to owner
        $response1 = $this->actingAs($user)->post('/user/switch-role');
        $response1->assertRedirect(route('owner.vehicles.index'));
        $user->refresh();
        $this->assertEquals('owner', $user->role);

        // Switch back to renter
        $response2 = $this->actingAs($user)->post('/user/switch-role');
        $response2->assertRedirect(route('renter.bookings'));
        $user->refresh();
        $this->assertEquals('renter', $user->role);
    }

    public function test_admin_is_protected_from_switching_roles(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/user/switch-role');
        $response->assertSessionHasErrors(['role']);

        $admin->refresh();
        $this->assertEquals('admin', $admin->role);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');
        $response->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_guest_is_redirected_from_protected_routes(): void
    {
        $this->get('/renter/bookings')->assertRedirect('/login');
        $this->get('/owner/vehicles')->assertRedirect('/login');
        $this->get('/admin/dashboard')->assertRedirect('/login');
    }

    public function test_role_authorization_middleware_enforced(): void
    {
        $renter = User::factory()->create(['role' => 'renter']);

        // Renter attempting owner route
        $ownerAttempt = $this->actingAs($renter)->get('/owner/vehicles');
        $ownerAttempt->assertRedirect('/');

        // Renter attempting admin route
        $adminAttempt = $this->actingAs($renter)->get('/admin/dashboard');
        $adminAttempt->assertRedirect('/');

        $owner = User::factory()->create(['role' => 'owner']);

        // Owner attempting admin route
        $ownerAdminAttempt = $this->actingAs($owner)->get('/admin/dashboard');
        $ownerAdminAttempt->assertRedirect('/');
    }
}
