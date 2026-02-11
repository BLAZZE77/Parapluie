<?php

namespace App\Controller;

use App\Repository\ParapluieRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class GalerieController extends AbstractController
{
    #[Route('/Gallery', name: 'GalleryApp')]
    public function index(ParapluieRepository $repository): Response
    {
    $parapluie = $repository->findall();

        return $this->render('home/index.html.twig', [
            'parapluie' => $parapluie ,
        ]);
    }
}