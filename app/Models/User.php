<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    const TYPE_ADMIN = 1;
    const TYPE_STUDENT = 2;
    
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 2;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->type == self::TYPE_ADMIN;
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function getUserTypeName(): string
    {
        if($this->id == 1 && $this->isAdmin())
        {
            return 'SuperAdmin';
        }
        return $this->isAdmin()? 'Admin' : 'Student';
    }

    public function getStatusName(): string
    {
        return $this->status == self::STATUS_ACTIVE ? 'Active' : 'Banned';
    }

    public function isActive()
    {
        return $this->status == self::STATUS_ACTIVE;
    }

    public function blockUser()
    {
        $this->status = self::STATUS_INACTIVE;
        $this->save();
    }

    public function unblockUser()
    {
        $this->status = self::STATUS_ACTIVE;
        $this->save();
    }
}
