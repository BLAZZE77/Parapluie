<?php

namespace App\Controller;

use App\Entity\Parapluie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Form\ParaForm;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class AddparapluieController extends AbstractController
{
    #[Route('/addparapluie', name: 'addparapluie')]
    public function index(Request $request , EntityManagerInterface $entityManager): Response
    {   
        $parapluie = new Parapluie();
        $form = $this->CreateForm(ParaForm::class,$parapluie);
        $form->handleRequest($request);

        if($form->IsSubmitted() && $form->isValid()){
            $entityManager->Persist($parapluie);
            $parapluie->setUser($this->getUser());
            $entityManager->flush();
            $this->addFlash('succes','Article ajouter avec succees !');
            return $this->redirectToRoute('home');

        }
        return $this->render('addparapluie/index.html.twig', [
            'ParaForm'=>$form->createView(),
        ]);
    }
}
